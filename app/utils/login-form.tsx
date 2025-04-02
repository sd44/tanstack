import { createServerValidate, getFormData, ServerValidateError } from '@tanstack/react-form/start';
import { createServerFn } from '@tanstack/react-start';
import { setResponseStatus } from '@tanstack/react-start/server';
import { toast } from 'sonner';
import authClient from '~/lib/utils/auth-client';
import { loginFormOpts, loginSchema } from '~/utils/login-isomophic';

const REDIRECT_URL = '/dashboard';

const serverValidate = createServerValidate({
  ...loginFormOpts,
  onServerValidate: loginSchema,
});

export const handleForm = createServerFn({
  method: 'POST',
})
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid form data');
    }
    return data;
  })
  .handler(async (ctx) => {
    try {
      const data = ctx.data;
      await serverValidate(data);
      await authClient.signIn.email(
        {
          email: data.get('email') as string,
          password: data.get('password') as string,
          rememberMe: true,
          callbackURL: REDIRECT_URL,
        },
        {
          onError: (ctx) => {
            console.warn(ctx);
            toast.error(ctx.error.message);
          },
          onSuccess: () => {
            toast.success('你已成功登录，我的朋友！');
          },
        },
      );
    } catch (e) {
      console.error(e);
      if (e instanceof ServerValidateError) {
        // Log form errors or do any other logic here
        return e.response;
      }

      // Some other error occurred when parsing the form
      setResponseStatus(500);
      return 'There was an internal error';
    }

    console.log('Form has validated successfully');
    return 'Form has validated successfully';
  });

export const getFormDataFromServer = createServerFn({ method: 'GET' }).handler(async () => {
  return getFormData();
});
