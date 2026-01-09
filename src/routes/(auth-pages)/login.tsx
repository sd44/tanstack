import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import type { ComponentProps } from 'react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { useAppForm } from '~/hooks/form';
import authClient, { getErrorMessage } from '~/lib/auth/auth-client';
import { cn } from '~/lib/utils';
import { capitalize } from '~/lib/utils/strtools';
import { loginOpts, loginSchema } from '~/utils/login-isomophic';

const REDIRECT_URL = '/dashboard';

export const Route = createFileRoute('/(auth-pages)/login')({
  component: LoginForm,
});

interface SocialButtonProps extends ComponentProps<typeof Button> {
  provider: 'microsoft' | 'github';
  imgsrc: string;
}

function SocialButton({ provider, imgsrc, className, ...props }: SocialButtonProps) {
  return (
    <Button
      className={cn('w-full', className)}
      variant="outline"
      {...props}
      onClick={() =>
        authClient.signIn.social({
          provider,
          callbackURL: REDIRECT_URL,
        })
      }
    >
      <img alt={provider} src={imgsrc} width="20" />
      {`${capitalize(provider)} `} 账户登录
    </Button>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const { redirectUrl } = Route.useRouteContext();

  const { mutate: emailLoginMutate, isPending } = useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      await authClient.signIn.email(
        {
          ...data,
          callbackURL: redirectUrl,
        },
        {
          onError: ({ error }) => {
            const err_code = error.code ?? '';
            const err_msg = getErrorMessage(err_code, 'zh-hans');
            toast.error(`登录错误：${err_msg}，请修订信息重新登录`);
          },
          // better-auth seems to trigger a hard navigation on login,
          // so we don't have to revalidate & navigate ourselves
          onSuccess: () => {
            toast.success('亲爱的朋友，你已成功登录！');
            navigate({ to: '/dashboard', replace: true });
          },
        },
      ),
  });

  const form = useAppForm({
    ...loginOpts,
    validators: {
      onChange: loginSchema,
    },
    onSubmit: ({ value }) => {
      emailLoginMutate(value);
    },
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-bold text-2xl">登录你的账户</h1>
        <p className="text-balance text-muted-foreground text-sm">请在下方输入您的邮箱和密码</p>
      </div>

      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppField name="email">
          {(field) => <field.TextField label="电子邮箱" />}
        </form.AppField>

        <form.AppField asyncDebounceMs={500} name="password">
          {(field) => <field.PasswordField label="密码" />}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton label="登录" />
        </form.AppForm>
      </form>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">其他登录方式</span>
      </div>
      <SocialButton imgsrc="/ico/msedge.svg" provider="microsoft" />
      <SocialButton imgsrc="/ico/github_black.svg" provider="github" />
      <div className="text-center text-base">
        还没有账户？{' '}
        <Link className="underline underline-offset-4" to="/signup">
          注册账户
        </Link>
      </div>
    </div>
  );
}
