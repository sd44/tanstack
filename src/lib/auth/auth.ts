import { createServerOnlyFn } from '@tanstack/react-start';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { multiSession, oAuthProxy, oidcProvider, openAPI } from 'better-auth/plugins';
import { tanstackStartCookies } from 'better-auth/tanstack-start';

import { env } from '~/env/server';
import { db } from '~/lib/db';

import { resend } from '~/lib/db/email/resend';
import { reactResetPasswordEmail } from '~/lib/db/email/reset-password';

// const from = env.BETTER_AUTH_EMAIL;
// const to = env.TEST_EMAIL;

const getAuthConfig = createServerOnlyFn(() =>
  betterAuth({
    appName: '墨韩的梦园',
    baseURL: env.VITE_BASE_URL,
    trustedOrigins: [env.VITE_BASE_URL, 'http://47.129.57.189:3000/'],
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),
    // TODO: 为user增加unit成员，方便以后扩展（可结合admin plugin role，比如role分为多级权限角色）
    user: {
      additionalFields: {
        unit: {
          type: 'string',
          required: false,
          defaultValue: '',
          input: false, // don't allow user to set role
        },
      },
    },
    emailVerification: {
      async sendVerificationEmail({ user, url }) {
        const _res = await resend.emails.send({
          from: env.BETTER_AUTH_EMAIL,
          to: env.TEST_EMAIL || user.email,
          subject: '请点击链接验证邮件地址',
          html: `<a href="${url}">验证你的邮件地址</a>`,
        });
      },
    },
    account: {
      accountLinking: {
        trustedProviders: ['microsoft', 'github', 'email-password'],
      },
    },
    // https://www.better-auth.com/docs/concepts/session-management#session-caching
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 minutes
      },
    },
    // https://www.better-auth.com/docs/authentication/email-password
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      autoSignIn: true,
      async sendResetPassword({ user, url }) {
        await resend.emails.send({
          from: env.BETTER_AUTH_EMAIL,
          to: user.email,
          subject: 'Reset your password',
          react: reactResetPasswordEmail({
            username: user.email,
            resetLink: url,
          }),
        });
      },
    },

    // https://www.better-auth.com/docs/concepts/oauth
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
      microsoft: {
        clientId: env.MICROSOFT_CLIENT_ID || '',
        clientSecret: env.MICROSOFT_CLIENT_SECRET || '',
        tenantId: 'common',
        requireSelectAccount: false,
      },
    },

    plugins: [
      tanstackStartCookies(),
      // admin({
      //   // adminRoles: ['admin', 'superadmin'],
      //   // adminUserIds: ['fVVf4ABR0IuWZ6lLvBmSWSLgvSYjWBfJ'],
      // }),
      openAPI(),
      multiSession(),
      oAuthProxy(),
      oidcProvider({
        loginPage: '/auth',
      }),
    ],
  }),
);

export const auth = getAuthConfig();
