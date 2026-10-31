import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import mongoose from 'mongoose';
import pinoHttp from 'pino-http';
import env from './config/env.js';
import logger from './utils/logger.js';
import ApiError from './utils/ApiError.js';
import errorHandler from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimiter.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration from validated env
const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl or postman)
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(ApiError.forbidden('Blocked by CORS policy'));
    },
    credentials: true,
  })
);

// Compression for response bodies
app.use(compression());

// Parse JSON and urlencoded request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Pino request logger
app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url === '/api/health',
    },
    genReqId: (req) => req.headers['x-request-id'] || crypto.randomUUID(),
  })
);

// Basic NoSQL injection sanitizer to strip '$' and '.' from user inputs
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
  };
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
});

// Apply global rate limiting to all /api routes
app.use('/api', globalLimiter);

/**
 * Health Check Endpoint
 * Specification: GET /health returns { db, embeddings: 'ready' | 'fallback', llm: 'enabled' | 'disabled', memoryMb }
 */
app.get(['/api/health', '/health'], (req, res) => {
  const mem = process.memoryUsage();
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      db: dbStatus,
      embeddings: env.EMBEDDINGS_ENABLED ? 'ready' : 'fallback',
      llm: env.AI_ENABLED ? 'enabled' : 'disabled',
      memoryMb: {
        rss: Math.round(mem.rss / (1024 * 1024)),
        heapTotal: Math.round(mem.heapTotal / (1024 * 1024)),
        heapUsed: Math.round(mem.heapUsed / (1024 * 1024)),
      },
    },
  });
});

// Catch 404 for unknown routes
app.use((req, res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
});

// Central error handler
app.use(errorHandler);

export default app;

