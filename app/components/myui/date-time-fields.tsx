import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '~/hooks/form-context';

import { MyDatePicker, type MyDatePickerProps } from './DateTimePicker';

export default function DateTimeField({
  label,
  labelCls = 'w-24',
  dateCls = '',
  value,
  onChange, // <--- 把 onChange 添加到这里解构出来
}: MyDatePickerProps) {
  const field = useFieldContext<Date | undefined>();

  const meta = useStore(field.store, (state) => state.meta);

  return (
    <div className="flex flex-wrap">
      <MyDatePicker
        label={label}
        labelCls={labelCls}
        dateCls={dateCls}
        value={value}
        onChange={(val) => field.handleChange(val)}
      />
      {meta.isTouched && meta.errors.length ? (
        <p className="w-full text-sm text-red-600">
          {meta.errors.map((err) => err.message).join(',')}
        </p>
      ) : null}
    </div>
  );
}
