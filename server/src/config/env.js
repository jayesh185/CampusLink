import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  MAX_RESUME_MB: z.coerce.number().default(5),
  AI_ENABLED: z
    .string()
    .optional()
    .default('false')
    .transform((val) => val === 'true'),
  LLM_BASE_URL: z.string().url().default('https://api.groq.com/openai/v1'),
  LLM_MODEL: z.string().optional().default('llama-3.3-70b-versatile'),
  LLM_API_KEY: z.string().optional().default(''),
  LLM_TIMEOUT_MS: z.coerce.number().default(15000),
  LLM_MAX_CONCURRENCY: z.coerce.number().default(2),
  EMBEDDINGS_ENABLED: z
    .string()
    .optional()
    .default('false')
    .transform((val) => val === 'true'),
  EMBEDDINGS_MODEL: z.string().default('Xenova/all-MiniLM-L6-v2'),
  EMBEDDINGS_THREADS: z.coerce.number().default(1),
  PARSE_THREADS: z.coerce.number().default(2),
  SKILL_MATCH_THRESHOLD: z.coerce.number().default(0.5),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment validation failed:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
export default env;

