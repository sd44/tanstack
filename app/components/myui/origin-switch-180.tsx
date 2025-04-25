import { useId, useState } from 'react';

import { Switch } from '~/components/ui/switch';
import { useEffect } from 'react';

export function SwitchBool({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const id = useId();
  const [checked, setChecked] = useState(value);

  useEffect(() => {
    onChange(checked);
  }, [checked]);

  const toggleSwitch = () => setChecked((prev) => !prev);

  return (
    <div
      className="group inline-flex items-center gap-2"
      data-state={checked ? 'checked' : 'unchecked'}>
      <span
        id={`${id}-off`}
        className="group-data-[state=checked]:text-muted-foreground/70 flex-1 cursor-pointer text-right text-sm font-medium"
        aria-controls={id}
        onClick={() => setChecked(false)}>
        否
      </span>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={toggleSwitch}
        aria-labelledby={`${id}-off ${id}-on`}
      />
      <span
        id={`${id}-on`}
        className="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left text-sm font-medium"
        aria-controls={id}
        onClick={() => setChecked(true)}>
        是
      </span>
    </div>
  );
}
