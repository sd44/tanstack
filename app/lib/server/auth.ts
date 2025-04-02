import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';

import {
  customSession,
  multiSession,
  oAuthProxy,
  oidcProvider,
  openAPI,
} from 'better-auth/plugins';
import { db } from './db';

import { resend } from './email/resend';
import { reactResetPasswordEmail } from './email/reset-password';

const from = process.env.BETTER_AUTH_EMAIL || '';
const to = process.env.TEST_EMAIL || '';

export const auth = betterAuth({
  baseURL: process.env.VITE_BASE_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  // TODO: 为user增加distinct和unit成员，方便以后扩展（可结合admin plugin role，比如role分为多级权限角色）
  user: {
    additionalFields: {
      distinct: {
        type: 'string',
        required: false,
        defaultValue: '',
        input: false, // don't allow user to set role
      },
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
      const res = await resend.emails.send({
        from,
        to: to || user.email,
        subject: '请点击链接验证邮件地址',
        html: `<a href="${url}">验证你的邮件地址</a>`,
      });
      console.log(res, user.email);
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
        from,
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
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID || '',
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
      tenantId: 'common',
      requireSelectAccount: false,
    },
  },

  plugins: [
    admin(),
    openAPI(),
    multiSession(),
    oAuthProxy(),
    oidcProvider({
      loginPage: '/auth',
    }),
    customSession(async (session) => {
      return {
        ...session,
        user: {
          ...session.user,
          dd: 'test',
        },
      };
    }),
  ],
});
