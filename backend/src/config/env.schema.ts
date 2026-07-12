import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PORT: z.coerce.number().default(3000),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  JWT_SECRET: z.string().min(1).default('development-secret'),
});

export type Env = z.infer<typeof envSchema>;
