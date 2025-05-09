'use client';

import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useAppForm } from '~/hooks/form';
import { SignUpEmail } from '~/utils/signup-email';
import { signUpOpts, signUpSchema } from '~/utils/signup-isomophic';

export const SignUpForm = () => {
  const router = useRouter();
  const form = useAppForm({
    ...signUpOpts,
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await SignUpEmail({ ...value });

        if (result.success) {
          router.navigate({ to: '/dashboard', replace: true });
          toast.success(`欢迎${result.name}，你已注册成功`);
          return;
        }

        toast.error(result.error);
        return;
      } catch (error) {
        console.error('Signup failed!');
      }
    },
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <form.AppField name="name" children={(field) => <field.TextField label="用户名" />} />
      <form.AppField name="email" children={(field) => <field.TextField label="电子邮箱" />} />
      <form.AppField name="password" children={(field) => <field.PasswordField label="密码" />} />
      <form.AppField
        name="confirm_password"
        children={(field) => <field.PasswordField label="确认密码" />}
      />
      <form.AppForm>
        <form.SubmitButton label="注册账户" />
      </form.AppForm>
    </form>
  );
};
