import { createFormHook } from '@tanstack/react-form';
import { lazy } from 'react';
import { Button } from '~/components/ui/button';
import { fieldContext, formContext, useFormContext } from './form-context';

const CascaderField = lazy(() => import('~/components/myui/cascader-field'));
const TextField = lazy(() => import('~/components/myui/text-fields'));
const PasswordField = lazy(() => import('~/components/myui/password-fields'));
const SelectField = lazy(() => import('~/components/myui/select-fields'));

export function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit}>
          {isSubmitting ? '提交中' : label}
        </Button>
      )}
    />
  );
}

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    PasswordField,
    SelectField,
    CascaderField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
