import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '~/hooks/form-context';
import { cn } from '~/lib/utils';
import { FieldMetaErr } from '~/utils/field-error';
import { Label } from '../ui/label';
import { DateTimePicker } from './shadcn-datetime-picker';

export interface DateTimeFieldT {
  label: string;
  labelCls?: string;
  dateCls?: string;
}

export default function DateTimeField({ label, labelCls = 'w-48', dateCls = '' }: DateTimeFieldT) {
  const field = useFieldContext<Date | undefined>();

  // Subscribe to the field's store to get reactive updates for value and meta
  const { value, meta } = useStore(field.store, (state) => ({
    value: state.value,
    meta: state.meta,
  }));

  return (
    <div className="flex flex-wrap">
      <Label aria-label="走访日期时间" className="flex w-full items-center gap-2">
        <div className={cn(labelCls)}>{label}</div>
        <DateTimePicker
          className={cn(dateCls, 'w-full *:not-first:ml-2')}
          // Use the reactive value from the form state.
          // Ensure it's `undefined` if the form value is `null` or other falsy values.
          date={value || undefined}
          // Use the field's handleChange method to update the form state.
          setDate={(val) => field.handleChange(val)}
        />
      </Label>
      <FieldMetaErr meta={meta} />
    </div>
  );
}
