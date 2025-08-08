import { useStore } from '@tanstack/react-form';
import { Label } from '~/components/ui/label';
import { useFieldContext } from '~/hooks/form-context';
import { FieldMetaErr } from '~/utils/field-error';
import { Switch } from '../ui/switch';

interface SwitchFieldProps {
  label: string;
  labelCls?: string; //labelCls 变为可选
}
export default function SwitchField({ label, labelCls = 'w-24' }: SwitchFieldProps) {
  const field = useFieldContext<boolean>();

  const meta = useStore(field.store, (state) => state.meta);

  return (
    <div className="flex flex-wrap">
      <Label className="flex w-full items-center gap-2">
        <div className={labelCls}>{label}</div>
        <Switch checked={field.state.value} onCheckedChange={(val) => field.handleChange(val)} />
      </Label>
      <FieldMetaErr meta={meta} />
    </div>
  );
}
