import { Link, createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { useAppForm } from '~/hooks/form';
import { cn } from '~/lib/utils';
import authClient, { getErrorMessage } from '~/lib/utils/auth-client';
import { capitalize } from '~/lib/utils/strTools';
import { loginOpts, loginSchema } from '~/utils/login-isomophic';

const REDIRECT_URL = '/dashboard';

export const Route = createFileRoute('/auth/login')({
  component: LoginForm,
});

interface SocialButtonProps extends ComponentProps<typeof Button> {
  provider: 'microsoft' | 'github';
  imgsrc: string;
}

function SocialButton({ provider, imgsrc, className, ...props }: SocialButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full"
      {...props}
      onClick={() =>
        authClient.signIn.social({
          provider,
          callbackURL: REDIRECT_URL,
        })
      }>
      <img src={imgsrc} alt={provider} width="20" />
      {capitalize(provider) + ' '} 账户登录
    </Button>
  );
}

function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const form = useAppForm({
    ...loginOpts,
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        /* await SignUpEmail({ ...value }); */
        const { data, error } = await authClient.signIn.email({
          email: value.email,
          password: value.password,
          callbackURL: REDIRECT_URL,
          rememberMe: true,
        });

        if (error) {
          console.error(error.message);
          const err_code = error.code ?? '';
          const err_msg = getErrorMessage(err_code, 'zh-hans');
          console.error(`登录错误：${err_msg}\n`);
          toast.error(`登录错误：${err_msg}，请修订信息重新登录`);
        } else {
          //redirect to the dashboard or sign in page
          toast.success('亲爱的朋友，你已成功登录！');
          router.navigate({ to: '/dashboard', replace: true });
        }
      } catch (error) {
        console.error('登录失败！');
      }
    },
  });

  return (
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">登录你的账户</h1>
        <p className="text-muted-foreground text-sm text-balance">请在下方输入您的邮箱和密码</p>
      </div>

      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}>
        <form.AppField name="email">
          {(field) => <field.TextField label="电子邮箱" />}
        </form.AppField>

        <form.AppField name="password" asyncDebounceMs={500}>
          {(field) => <field.PasswordField label="密码" />}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton label="登录" />
        </form.AppForm>
      </form>

      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">其他登录方式</span>
      </div>
      <SocialButton provider="microsoft" imgsrc="/ico/msedge.svg" />
      <SocialButton provider="github" imgsrc="/ico/github_black.svg" />
      <div className="text-center text-base">
        还没有账户？{' '}
        <Link to="/auth/signup" className="underline underline-offset-4">
          注册账户
        </Link>
      </div>
    </div>
  );
}
