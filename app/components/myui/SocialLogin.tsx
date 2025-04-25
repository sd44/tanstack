import type { ComponentProps } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import authClient from '~/lib/utils/auth-client';

const REDIRECT_URL = '/dashboard';

interface SignInButtonProps extends ComponentProps<typeof Button> {
  provider: 'microsoft' | 'github';
  label: string;
}

function SignInButton({ provider, label, className, ...props }: SignInButtonProps) {
  return (
    <Button
      onClick={() =>
        authClient.signIn.social({
          provider,
          callbackURL: REDIRECT_URL,
        })
      }
      type="button"
      variant="outline"
      size="lg"
      className={cn('text-white hover:text-white', className)}
      {...props}>
      Sign in with {label}
    </Button>
  );
}
