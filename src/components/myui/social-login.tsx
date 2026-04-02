import { useMutation } from '@tanstack/react-query';
import type { ComponentProps } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import authClient from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils';

const REDIRECT_URL = '/dashboard';

interface SignInButtonProps extends ComponentProps<typeof Button> {
  label: string;
  provider: 'microsoft' | 'github';
}

function _SignInButton({ provider, label, className, ...props }: SignInButtonProps) {
  const mutation = useMutation({
    mutationFn: async () =>
      await authClient.signIn.social(
        {
          provider,
          callbackURL: REDIRECT_URL,
        },
        {
          // CSRF protection for social sign-in
          csrfProtection: true,
          onSuccess: () => {
            toast.success(`Successfully signed in with ${label}`);
          },
          onError: ({ error }) => {
            toast.error(error.message || `An error occurred during ${label} sign-in.`);
          },
        },
      ),
  });

  return (
    <Button
      className={cn('text-white hover:text-white', className)}
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
      size="lg"
      type="button"
      variant="outline"
      {...props}
    >
      {mutation.isPending ? `Signing in with ${label}...` : `Sign in with ${label}`}
    </Button>
  );
}
