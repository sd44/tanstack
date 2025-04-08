'use client';
import lDebounce from 'lodash/debounce';
import { InputHTMLAttributes, useEffect, useState } from 'react';
import { Input } from '~/components/ui/input';

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 800,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState<string | number>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const debounced = lDebounce(() => {
      onChange(value);
    }, debounce);

    debounced();

    return () => {
      debounced.cancel();
    };
  }, [value, debounce, onChange]);

  return (
    <Input
      {...props}
      value={value ?? ''}
      onChange={(e) => {
        if (e.target.value === '') return setValue('');
        if (props.type === 'number') {
          setValue(e.target.valueAsNumber);
        } else {
          setValue(e.target.value);
        }
      }}
    />
  );
}
