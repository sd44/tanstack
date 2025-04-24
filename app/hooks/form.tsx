import { createFormHook } from '@tanstack/react-form';
import { lazy } from 'react';
import { Button } from '~/components/ui/button';
import { fieldContext, formContext, useFormContext } from './form-context';

import CascaderField from '~/components/myui/cascader-field';
import TextField from '~/components/myui/text-fields';
import PasswordField from '~/components/myui/password-fields';
import SelectField from '~/components/myui/select-fields';
import DateTimeField from '~/components/myui/date-time-fields';
import SwitchField from '~/components/myui/switch-field';
import TextareaField from '~/components/myui/textarea-fields';
/* const CascaderField = lazy(() => import('~/components/myui/cascader-field'));
 * const TextField = lazy(() => import('~/components/myui/text-fields'));
 * const PasswordField = lazy(() => import('~/components/myui/password-fields'));
 * const SelectField = lazy(() => import('~/components/myui/select-fields'));
 * const DateTimeField = lazy(() => import('~/components/myui/date-time-fields'));
 * const SwitchField = lazy(() => import('~/components/myui/switch-field'));
 * const TextareaField = lazy(() => import('~/components/myui/textarea-fields')); */

export function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();

  console.log(JSON.stringify(form.getAllErrors()));
  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => {
        return (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? '提交中' : label}
          </Button>
        );
      }}
    />
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
