const { z } = require('zod');

const envSchema = z.object({
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASS: z.string().min(1),
  DB_HOST: z.string().min(1).default('localhost'),
  PORT: z.preprocess(
    (value) => (value === undefined || value === '' ? undefined : value),
    z.coerce.number().int().positive().default(3000)
  ),
  JWT_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  APPLE_CLIENT_ID: z.string().min(1).optional(),
  APPLE_TEAM_ID: z.string().min(1).optional(),
  APPLE_KEY_ID: z.string().min(1).optional(),
  APPLE_PRIVATE_KEY: z.string().min(1).optional()
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  const errors = env.error.flatten().fieldErrors;
  const formatted = Object.entries(errors)
    .map(([key, value]) => `${key}: ${value.join(', ')}`)
    .join(' | ');
  throw new Error(`Environment validation failed: ${formatted}`);
}

module.exports = env.data;
