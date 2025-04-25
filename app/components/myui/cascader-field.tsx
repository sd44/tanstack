import { useStore } from '@tanstack/react-form';
import { useState } from 'react';
import { Label } from '~/components/ui/label';
import { useFieldContext } from '~/hooks/form-context';
import type { OptionsType } from './nested-dropdown';
import { NestedDropMenu } from './nested-dropdown';

interface CascaderFieldProps {
  options: OptionsType; //传递给ant design cascader的JSON对象
  label: string;
  labelCls?: string; //labelCls 变为可选
  cascaderStyle?: object; //labelCls 变为可选
  placeholder?: string;
}

export default function CascaderField({
  options,
  label,
  labelCls = 'w-24',
  placeholder = '请选择',
}: CascaderFieldProps) {
  const field = useFieldContext<string>();
  const meta = useStore(field.store, (state) => state.meta);
  const [selectedLabel, setSelectedLabel] = useState<string>(placeholder);

  const onValueChange = (value: string | null, label: string | null) => {
    if (value) {
      field.handleChange(value);
      setSelectedLabel(label || placeholder);
    } else {
      // Handle clear action
      field.handleChange(''); // Reset field value to empty string
      setSelectedLabel(placeholder); // Reset to default placeholder
    }
  };

  return (
    <div className="flex flex-wrap">
      <Label className="flex w-full items-center gap-2">
        <div className={labelCls}>{label}</div>
        <NestedDropMenu
          labelName={selectedLabel}
          options={options}
          initialValue={field.state.value}
          onValueChange={onValueChange}
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
