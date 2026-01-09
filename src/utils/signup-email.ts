import authClient, { getErrorMessage } from '~/lib/auth/auth-client';

export async function SignUpEmail({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const { data, error } = await authClient.signUp.email({
    name,
    email,
    password,
    callbackURL: '/dashboard', // a url to redirect to after the user verifies their email (optional)
  });

  if (error) {
    const err_code = error.code ?? '';
    const err_msg = getErrorMessage(err_code, 'zh-hans');
    const err = `注册信息错误：${err_msg}`;
    return { success: false, error: err };
  }

  return { success: true, name: data.user?.name };
}
