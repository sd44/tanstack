import { useStore } from '@tanstack/react-form';
import { PasswordInput } from '~/components/myui/origin-password';
import { Label } from '~/components/ui/label';
import { useFieldContext } from '~/hooks/form-context';

import { cn } from '~/lib/utils';

interface PasswordFieldProps extends React.ComponentProps<typeof PasswordInput> {
  label: string;
  labelCls?: string; //labelCls 变为可选
}

export default function PasswordField({ label, labelCls = 'w-24' }: PasswordFieldProps) {
  const field = useFieldContext<string>();

  const meta = useStore(field.store, (state) => state.meta);

  return (
    <div className="flex flex-wrap">
      <Label className="flex w-full items-center gap-2">
        <div className={labelCls}>{label}</div>
        <PasswordInput
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          className={cn('flex-grow rounded border px-2 py-1')}
        />
      </Label>
      {meta.isTouched && meta.errors.length ? (
        <p className="w-full text-sm text-red-600">
          {meta.errors.map((err) => err.message).join(',')}
        </p>
      ) : null}
    </div>
  );
}
