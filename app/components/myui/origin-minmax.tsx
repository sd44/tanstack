import debounce from 'lodash/debounce';
import { useEffect, useId, useMemo, useState } from 'react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export function MinMaxInput() {
  const id = useId();
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');

  // Use useMemo to create the debounced function only once
  // unless the delay itself were to change (which it doesn't here)
  const logValues = useMemo(() => {
    return debounce((min: string, max: string) => {
      console.log('Debounced values:', { min, max });
    }, 1000); // 1300ms debounce delay
  }, []); // Empty dependency array means it's created once

  useEffect(() => {
    logValues.cancel();
    logValues(minValue, maxValue);
  }, [minValue, maxValue]);
  return (
    <div className="*:not-first:mt-2">
      <Label className="flex-1">Range</Label>
      <div className="flex">
        <Input
          id={`${id}-1`}
          className="flex-1 rounded-e-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="最小值"
          type="number"
          aria-label="最小值"
          value={minValue}
          onChange={(e) => setMinValue(e.target.value)}
        />
        <Input
          id={`${id}-2`}
          className="-ms-px flex-1 rounded-s-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="最大值"
          type="number"
          aria-label="最大值"
          value={maxValue}
          onChange={(e) => setMaxValue(e.target.value)}
        />
      </div>
    </div>
  );
}
