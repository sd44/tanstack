import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '~/hooks/form-context';
import { FieldMetaErr } from '~/utils/field-error';
import { MyDatePicker, type MyDatePickerProps } from './date-time-picker';

export default function DateTimeField({
  label,
  labelCls = 'w-32',
  dateCls = '',
  value,
}: MyDatePickerProps) {
  const field = useFieldContext<Date | undefined>();

  const meta = useStore(field.store, (state) => state.meta);

  return (
    <div className="flex flex-wrap">
      <MyDatePicker
        dateCls={dateCls}
        label={label}
        labelCls={labelCls}
        onChange={(val) => field.handleChange(val)}
        value={value}
      />
      <FieldMetaErr meta={meta} />
    </div>
  );
}
