import { useStore } from '@tanstack/react-form';
import type { CascaderProps } from 'antd';
import { Cascader } from 'antd';
import { Label } from '~/components/ui/label';
import { useFieldContext } from '~/hooks/form-context.tsx';

interface CascaderFieldProps {
  options: object; //传递给ant design cascader的JSON对象
  label: string;
  labelCls?: string; //labelCls 变为可选
  cascaderStyle: object; //labelCls 变为可选
}

export default function CascaderField({
  options,
  label,
  labelCls = 'w-24',
  cascaderStyle = { width: '300px' },
}: CascaderFieldProps) {
  const field = useFieldContext<string>();
  const meta = useStore(field.store, (state) => state.meta);

  const displayRender = (labels: string[]) => {
    if (labels.length == 0) {
      return undefined;
    }
    return labels[labels.length - 1];
  };

  const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
      (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );

  const onChange: CascaderProps<Option>['onChange'] = (value) => {
    // ant design cascader在清除数据后，有可能返回一个undefine changeEvent
    if (value === undefined) {
      return undefined;
    }
    console.log(value);
    if (value.length > 0) {
      field.handleChange(value[value.length - 1]);
    }
  };

  return (
    <div>
      <Label className="flex items-center gap-2 w-full">
        <div className={labelCls}>{label}</div>
        <Cascader
          style={cascaderStyle}
          options={options}
          displayRender={displayRender}
          showSearch={{ filter }}
          onSearch={(value) => console.log(value)}
          value={field.state.value}
          onChange={onChange}
        />
      </Label>
      {meta.isTouched && meta.errors.length ? (
        <p className="text-sm text-red-600">{meta.errors.map((err) => err.message).join(',')}</p>
      ) : null}
    </div>
  );
}
