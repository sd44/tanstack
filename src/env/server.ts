import { createEnv } from '@t3-oss/env-core';
import * as z from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    VITE_BASE_URL: z.url().default('http://localhost:3000'),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_EMAIL: z.string().min(1),
    TEST_EMAIL: z.string().optional(),

    // OAuth2 providers, optional, update as needed
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    MICROSOFT_CLIENT_ID: z.string().optional(),
    MICROSOFT_CLIENT_SECRET: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
  },
  runtimeEnv: process.env,
});
