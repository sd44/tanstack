import { createFormHook } from '@tanstack/react-form';
// import { lazy } from 'react';
import CascaderField from '~/components/myui/cascader-field';
import DateTimeField from '~/components/myui/date-time-fields';
import PasswordField from '~/components/myui/password-fields';
import SelectField from '~/components/myui/select-fields';
import SwitchField from '~/components/myui/switch-field';
import TextField from '~/components/myui/text-fields';
import TextareaField from '~/components/myui/textarea-fields';
import { Button } from '~/components/ui/button';
import { fieldContext, formContext, useFormContext } from './form-context';
// const CascaderField = lazy(() => import('~/components/myui/cascader-field'));
// const TextField = lazy(() => import('~/components/myui/text-fields'));
// const PasswordField = lazy(() => import('~/components/myui/password-fields'));
// const SelectField = lazy(() => import('~/components/myui/select-fields'));
// const DateTimeField = lazy(() => import('~/components/myui/date-time-fields'));
// const SwitchField = lazy(() => import('~/components/myui/switch-field'));
// const TextareaField = lazy(() => import('~/components/myui/textarea-fields'));

export function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => {
        return (
          <Button disabled={!canSubmit} type="submit">
            {isSubmitting ? '提交中' : label}
          </Button>
        );
      }}
    </form.Subscribe>
  );
}

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    PasswordField,
    SelectField,
    CascaderField,
    DateTimeField,
    SwitchField,
    TextareaField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
