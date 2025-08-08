import { useStore } from '@tanstack/react-form';
import { PasswordInput } from '~/components/myui/origin-password';
import { Label } from '~/components/ui/label';
import { useFieldContext } from '~/hooks/form-context';

import { cn } from '~/lib/utils';
import { FieldMetaErr } from '~/utils/field-error';

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
          className={cn('flex-grow rounded border px-2 py-1')}
          onChange={(e) => field.handleChange(e.target.value)}
          value={field.state.value}
        />
      </Label>
      <FieldMetaErr meta={meta} />
    </div>
  );
}
