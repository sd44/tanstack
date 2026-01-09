import { genericOAuthClient, multiSessionClient, oidcClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { toast } from 'sonner';
import { env } from '~/env/client';

const authClient = createAuthClient({
  baseURL: env.VITE_BASE_URL,
  // plugins: [adminClient(), multiSessionClient(), oidcClient(), genericOAuthClient()],
  plugins: [multiSessionClient(), oidcClient(), genericOAuthClient()],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error('Too many requests. Please try again later.');
      }
    },
  },
});

export default authClient;

authClient.$store.listen('$sessionSignal', async () => {
  /* don't need*/
});

type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    {
      en: string;
      'zh-hans': string;
    }
  >
>;

const errorCodes = {
  INVALID_PASSWORD: { en: 'invalid password', 'zh-hans': '密码错误' },
  INVALID_EMAIL: { en: 'invalid email', 'zh-hans': 'email错误' },
  INVALID_TOKEN: { en: 'invalid token', 'zh-hans': 'token错误' },
  USER_NOT_FOUND: { en: 'User not found', 'zh-hans': '用户不存在' },
  FAILED_TO_CREATE_USER: {
    en: 'Failed to create user',
    'zh-hans': '创建用户失败',
  },
  FAILED_TO_CREATE_SESSION: {
    en: 'Failed to create session',
    'zh-hans': '创建会话失败',
  },
  FAILED_TO_UPDATE_USER: {
    en: 'Failed to update user',
    'zh-hans': '更新用户失败',
  },
  FAILED_TO_GET_SESSION: {
    en: 'Failed to get session',
    'zh-hans': '获取会话失败',
  },
  INVALID_EMAIL_OR_PASSWORD: {
    en: 'Invalid email or password',
    'zh-hans': '邮箱或密码无效',
  },
  SOCIAL_ACCOUNT_ALREADY_LINKED: {
    en: 'Social account already linked',
    'zh-hans': '社交账号已关联',
  },
  PROVIDER_NOT_FOUND: { en: 'Provider not found', 'zh-hans': '未找到提供商' },
  ID_TOKEN_NOT_SUPPORTED: {
    en: 'id_token not supported',
    'zh-hans': '不支持id_token',
  },
  FAILED_TO_GET_USER_INFO: {
    en: 'Failed to get user info',
    'zh-hans': '获取用户信息失败',
  },
  USER_EMAIL_NOT_FOUND: {
    en: 'User email not found',
    'zh-hans': '未找到用户邮箱',
  },
  EMAIL_NOT_VERIFIED: { en: 'Email not verified', 'zh-hans': '邮箱未验证' },
  PASSWORD_TOO_SHORT: { en: 'Password too short', 'zh-hans': '密码太短' },
  PASSWORD_TOO_LONG: { en: 'Password too long', 'zh-hans': '密码太长' },
  USER_ALREADY_EXISTS: { en: 'User already exists', 'zh-hans': '该账户已存在' },
  EMAIL_CAN_NOT_BE_UPDATED: {
    en: 'Email can not be updated',
    'zh-hans': '邮箱无法更新',
  },
  CREDENTIAL_ACCOUNT_NOT_FOUND: {
    en: 'Credential account not found',
    'zh-hans': '凭据账号未找到',
  },
  SESSION_EXPIRED: {
    en: 'Session expired. Re-authenticate to perform this action.',
    'zh-hans': '会话过期。请重新进行身份验证以执行此操作。',
  },
  FAILED_TO_UNLINK_LAST_ACCOUNT: {
    en: "You can't unlink your last account",
    'zh-hans': '您无法取消关联您的最后一个帐户',
  },
  ACCOUNT_NOT_FOUND: { en: 'Account not found', 'zh-hans': '帐户不存在' },
} satisfies ErrorTypes;

export const getErrorMessage = (code: string, lang: 'en' | 'zh-hans' = 'zh-hans') => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes][lang];
  }
  return code;
};
