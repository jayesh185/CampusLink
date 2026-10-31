import app from './app.js';
import env from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import logger from './utils/logger.js';

let server;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    server = app.listen(env.PORT, () => {
      const mem = process.memoryUsage();
      logger.info(
        {
          port: env.PORT,
          env: env.NODE_ENV,
          memoryRssMb: Math.round(mem.rss / (1024 * 1024)),
          memoryHeapUsedMb: Math.round(mem.heapUsed / (1024 * 1024)),
        },
        `🚀 CampusLink API running on http://localhost:${env.PORT}`
      );
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

// Graceful shutdown helper
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      try {
        await disconnectDB();
        logger.info('All resources cleaned up. Exiting process.');
        process.exit(0);
      } catch (err) {
        logger.error({ err }, 'Error during database disconnection');
        process.exit(1);
      }
    });

    // Force shutdown if cleanup takes too long
    setTimeout(() => {
      logger.error('Graceful shutdown timeout exceeded. Force closing.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Promise Rejection detected');
});

process.on('uncaughtException', (error) => {
  logger.error({ error }, 'Uncaught Exception detected');
  gracefulShutdown('uncaughtException');
});

startServer();

