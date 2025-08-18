import type { ComponentProps } from 'react';
import { Button } from '~/components/ui/button';
import authClient from '~/lib/auth/auth-client';
import { cn } from '~/lib/utils';

const REDIRECT_URL = '/dashboard';

interface SignInButtonProps extends ComponentProps<typeof Button> {
  provider: 'microsoft' | 'github';
  label: string;
}

function _SignInButton({ provider, label, className, ...props }: SignInButtonProps) {
  return (
    <Button
      className={cn('text-white hover:text-white', className)}
      onClick={() =>
        authClient.signIn.social({
          provider,
          callbackURL: REDIRECT_URL,
        })
      }
      size="lg"
      type="button"
      variant="outline"
      {...props}
    >
      Sign in with {label}
    </Button>
  );
}
