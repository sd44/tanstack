import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '~/hooks/form-context';
import { cn } from '~/lib/utils';
import { SwitchBool } from './origin-switch-180';
import { Label } from '~/components/ui/label';

interface SwitchFieldProps {
  label: string;
  labelCls?: string; //labelCls 变为可选
  inputCls?: string; //inputCls 变为可选
}
export default function SwitchField({ label, labelCls = 'w-24', inputCls = '' }: SwitchFieldProps) {
  const field = useFieldContext<boolean>();

  const meta = useStore(field.store, (state) => state.meta);

  return (
    <div className="flex flex-wrap">
      <Label className="flex w-full items-center gap-2">
        <div className={labelCls}>{label}</div>
        <SwitchBool value={field.state.value} onChange={(val) => field.handleChange(val)} />
      </Label>
      {meta.isTouched && meta.errors.length ? (
        <p className="w-full text-sm text-red-600">
          {meta.errors.map((err) => err.message).join(',')}
        </p>
      ) : null}
    </div>
  );
}
