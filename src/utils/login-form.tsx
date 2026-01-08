import { createServerValidate, getFormData, ServerValidateError } from '@tanstack/react-form/start';
import { createServerFn } from '@tanstack/react-start';
import { setResponseStatus } from '@tanstack/react-start/server';
import { toast } from 'sonner';
import authClient from '~/lib/auth/auth-client';
import { loginOpts, loginSchema } from '~/utils/login-isomophic';

const REDIRECT_URL = '/dashboard';

const serverValidate = createServerValidate({
  ...loginOpts,
  onServerValidate: loginSchema,
});

export const handleForm = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid form data');
    }
    return data;
  })
  .handler(async (ctx) => {
    try {
      const data = await serverValidate(ctx.data);
      await authClient.signIn.email(
        {
          email: data.email as string,
          password: data.password,
          rememberMe: true,
          callbackURL: REDIRECT_URL,
        },
        {
          onError: (ctxerr) => {
            toast.error(ctxerr.error.message);
          },
          onSuccess: () => {
            toast.success('你已成功登录，我的朋友！');
          },
        },
      );
    } catch (e) {
      if (e instanceof ServerValidateError) {
        // Log form errors or do any other logic here
        setResponseStatus(400);
        return 'There was a validation error';
      }

      // Some other error occurred when parsing the form
      setResponseStatus(500);
      return 'There was an internal error';
    }
    return 'Form has validated successfully';
  });

export const getFormDataFromServer = createServerFn({ method: 'GET' }).handler(async () => {
  return await getFormData();
});
