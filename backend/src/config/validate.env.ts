import { envSchema } from './env.schema';

export function validate(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    console.error('\nEnvironment validation failed:\n');

    console.error(parsed.error.format());

    process.exit(1);
  }

  return parsed.data;
}
