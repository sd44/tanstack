import { useStore } from '@tanstack/react-form';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { useFieldContext } from '~/hooks/form-context';
import { cn } from '~/lib/utils';

interface TextareaProps extends React.ComponentProps<'textarea'> {
  label: string;
  labelCls?: string; //labelCls 变为可选
  inputCls?: string; //inputCls 变为可选
}

export default function TextareaField({
  label,
  labelCls = 'w-24',
  inputCls = '',
  ...props
}: TextareaProps) {
  const field = useFieldContext<string>();

  const meta = useStore(field.store, (state) => state.meta);

  return (
    <div className="flex flex-wrap">
      <Label className="flex w-full items-center gap-2">
        <div className={labelCls}>{label}</div>
        <Textarea
          defaultValue={field.state.value ?? ''}
          onChange={(e) => field.handleChange(e.target.value)}
          className={cn('flex-grow rounded border px-2 py-1', inputCls)}
          {...props}
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
