import 'dotenv/config';

import z from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  SFTP_HOST: z.coerce.string().min(1),
  SFTP_PORT: z.coerce.number(),
  SFTP_USER: z.coerce.string().min(1),
  SFTP_PASS: z.coerce.string().min(1),
  DITAT_BASE: z.coerce.string().min(1),
  DITAT_ACCOUNT: z.coerce.string().min(1),
  DITAT_CLIENT_ID: z.coerce.string().min(1),
  DITAT_CLIENT_SECRET: z.coerce.string().min(1),
  STORE_ID: z.coerce.string(),
  PRICE: z.coerce.string(),
  EFFECTIVE_DATE: z.coerce.string(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Invalid environment variables');
  console.error(z.prettifyError(result.error));
  process.exit(1);
}

console.log('[+] All variables loaded.');

export const envs = result.data;
