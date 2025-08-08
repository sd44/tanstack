import { useStore } from '@tanstack/react-form';
import { useState } from 'react';
import { Label } from '~/components/ui/label';
import { useFieldContext } from '~/hooks/form-context';
import { FieldMetaErr } from '~/utils/field-error';
import type { OptionsType } from './nested-dropdown';
import { NestedDropMenu } from './nested-dropdown';

interface CascaderFieldProps {
  options: OptionsType; //传递给ant design cascader的JSON对象
  labelStr: string;
  labelCls?: string; //labelCls 变为可选
  cascaderStyle?: object; //labelCls 变为可选
  placeholder?: string;
}

export default function CascaderField({
  options,
  labelStr,
  labelCls = 'w-24',
  placeholder = '请选择',
}: CascaderFieldProps) {
  const field = useFieldContext<string>();
  const meta = useStore(field.store, (state) => state.meta);
  const [selectedLabel, setSelectedLabel] = useState<string>(placeholder);

  const onValueChange = (value: string | null, labelChange: string | null) => {
    if (value) {
      field.handleChange(value);
      setSelectedLabel(labelChange || placeholder);
    } else {
      // Handle clear action
      field.handleChange(''); // Reset field value to empty string
      setSelectedLabel(placeholder); // Reset to default placeholder
    }
  };

  return (
    <div className="flex flex-wrap">
      <Label className="flex w-full items-center gap-2">
        <div className={labelCls}>{labelStr}</div>
        <NestedDropMenu
          initialValue={field.state.value}
          labelName={selectedLabel}
          onValueChange={onValueChange}
          options={options}
        />
      </Label>
      <FieldMetaErr meta={meta} />
    </div>
  );
}
