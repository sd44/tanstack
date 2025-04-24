import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';
import { useId, useState } from 'react';
import { Input } from '~/components/ui/input';

import { cn } from '~/lib/utils';

export const PasswordInput = ({
  className,
  ...props
}: Omit<React.ComponentProps<'input'>, 'type'>) => {
  const id = useId();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="relative w-full">
      <Input
        id={id}
        className={cn('pe-9', className)}
        placeholder="请输入密码"
        type={isVisible ? 'text' : 'password'}
        {...props}
      />
      <button
        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        onClick={toggleVisibility}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        aria-pressed={isVisible}
        aria-controls="password">
        {isVisible ? (
          <EyeOffIcon size={16} aria-hidden="true" />
        ) : (
          <EyeIcon size={16} aria-hidden="true" />
        )}
      </button>
    </div>
  );
};
