import { useStore } from '@tanstack/react-form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useFieldContext } from '~/hooks/form-context';
import { cn } from '~/lib/utils';

import { FieldMetaErr } from '~/utils/field-error';

interface TextFieldProps extends React.ComponentProps<typeof Input> {
  label: string;
  labelCls?: string; //labelCls 变为可选
  inputCls?: string; //inputCls 变为可选
}

export default function TextField({
  label,
  labelCls = 'w-24',
  inputCls = '',
  ...props
}: TextFieldProps) {
  const field = useFieldContext<string>();

  const meta = useStore(field.store, (state) => state.meta);

  return (
    <div className="flex flex-wrap">
      <Label className="flex w-full items-center gap-2">
        <div className={labelCls}>{label}</div>
        <Input
          className={cn('flex-grow rounded border px-2 py-1', inputCls)}
          onChange={(e) => field.handleChange(e.target.value.trim())}
          value={field.state.value ?? ''}
          {...props}
        />
      </Label>
      <FieldMetaErr meta={meta} />
    </div>
  );
}
