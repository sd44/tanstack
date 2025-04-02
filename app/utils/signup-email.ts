import authClient, { getErrorMessage } from '~/lib/utils/auth-client';

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
    name: name,
    email: email,
    password: password,
    callbackURL: '/dashboard', // a url to redirect to after the user verifies their email (optional)
  });

  if (error) {
    console.error(error.message);
    const err_code = error.code ?? '';
    const err_msg = getErrorMessage(err_code, 'zh-hans');
    const err = `注册信息错误：${err_msg}`;
    console.error(err);
    return { success: false, error: err };
  }
  console.log('已成功注册！');
  return { success: true, name: data.name };
}
