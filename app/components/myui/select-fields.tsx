import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import { useStore } from '@tanstack/react-form';
import { Label } from '~/components/ui/label';
import { useFieldContext } from '~/hooks/form-context';

interface SelectFieldProps extends React.ComponentProps<typeof SelectValue> {
  label: string;
  labelCls?: string; //labelCls 变为可选
  selectCls?: string; //inputCls 变为可选
  items: string[];
}

export default function SelectField({
  label,
  labelCls = 'w-36',
  selectCls = 'w-full',
  items,
  ...props
}: SelectFieldProps) {
  const field = useFieldContext<string>();

  const meta = useStore(field.store, (state) => state.meta);

  return (
    <div className="flex">
      <Label className="flex w-full items-center gap-2">
        <div className={labelCls}>{label}</div>
        <Select
          value={field.state.value ?? ''}
          onValueChange={(value) => field.handleChange(value)}>
          <SelectTrigger className={selectCls}>
            <SelectValue {...props} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{label}</SelectLabel>
              {items.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Label>
      {meta.isTouched && meta.errors.length ? (
        <p className="w-full text-sm text-red-600">
          {meta.errors.map((err) => err.message).join(',')}
        </p>
      ) : null}
    </div>
  );
}
