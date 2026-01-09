'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useAppForm } from '~/hooks/form';
import authClient from '~/lib/auth/auth-client';
import { authQueryOptions } from '~/lib/auth/queries';
import { signUpOpts, signUpSchema } from '~/utils/signup-isomophic';

const SignupForm = () => {
  const { redirectUrl = '/' } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: signupMutate } = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      confirm_password: string;
    }) => {
      const { confirm_password: _, ...signUpData } = data;
      await authClient.signUp.email(
        {
          ...signUpData,
          callbackURL: redirectUrl,
        },
        {
          onError: ({ error }) => {
            toast.error(error.message || 'An error occurred while signing up.');
          },
          onSuccess: () => {
            queryClient.removeQueries({ queryKey: authQueryOptions().queryKey });

            navigate({ to: redirectUrl, replace: true });
            toast.success('注册成功');
          },
        },
      );
    },
  });

  const form = useAppForm({
    ...signUpOpts,
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: ({ value }) => {
      signupMutate(value);
    },
  });

  return (
    <div className="container">
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">新用户注册</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.AppField name="name">
              {(field) => <field.TextField label="用户名" />}
            </form.AppField>
            <form.AppField name="email">
              {(field) => <field.TextField label="电子邮箱" />}
            </form.AppField>

            <form.AppField name="password">
              {(field) => <field.PasswordField label="密码" />}
            </form.AppField>

            <form.AppField name="confirm_password">
              {(field) => <field.PasswordField label="确认密码" />}
            </form.AppField>
            <form.AppForm>
              <form.SubmitButton label="注册账户" />
            </form.AppForm>
          </form>

          <div className="mt-4 text-center text-base">
            已有账户？{' '}
            <Link className="underline" to="/login">
              登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/(auth-pages)/signup')({
  component: SignupForm,
});
