import React from 'react';
import { toast } from 'sonner';
import { Separator } from '~/components/ui/separator';
import { useAppForm } from '~/hooks/form';
import {
  type inputVisits,
  visitTypeValues,
  visitValidationSchema,
} from '~/lib/zod/visits-validator';
import { useStore } from '@tanstack/react-store';
import { handleVisitsForm } from '~/lib/server/handle-visitors';

// TODO: 参考 visits-data的fetchVisitsDatas获取当前用户的企业列表。
export const VisitForm = () => {
  const form = useAppForm({
    defaultValues: {} as inputVisits,
    validators: {
      onChange: visitValidationSchema,
    },
    onSubmit: async ({ value }) => {
      const msg = await handleVisitsForm({ data: value });
      if (msg.success) {
        toast.success('提交成功');
      } else {
        toast.error(msg.error);
      }
    },
  });

  const hasDemand = useStore(form.store, (state) => state.values.hasCompanyDemand);
  const isCompleted = useStore(form.store, (state) => state.values.isCompleted);

  React.useEffect(() => {
    if (!hasDemand) {
      form.resetField('companyDemand');
      form.resetField('isCompleted');
      form.resetField('completedDescription');
      form.resetField('completionTime');
    }
  }, [hasDemand]);

  React.useEffect(() => {
    if (!isCompleted) {
      form.resetField('completedDescription');
      form.resetField('completionTime');
    }
  }, [isCompleted]);
  React.useEffect(() => {
    form.setFieldValue('companyName', '123');
  }, []);
  // TODO: var my username company list
  return (
    <form
      className="mx-8 grid grid-cols-1 gap-x-8 gap-y-4 md:mx-8 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <form.AppField
        name="companyName"
        children={(field) => (
          <field.TextField
            label="企业名称"
            labelCls="w-36 "
            required
            placeholder="与营业执照一致"
          />
        )}
      />

      <form.AppField
        name="visitTime"
        children={(field) => <field.DateTimeField label="走访时间" labelCls="w-48 required" />}
      />

      <form.AppField
        name="visitType"
        children={(field) => (
          <field.SelectField
            label="走访类型"
            labelCls="w-36 after:ml-0.5 after:text-red-500 after:content-['*'] after:text-lg required"
            items={visitTypeValues}
          />
        )}
      />

      <Separator className="col-span-full my-2 border-gray-200" />

      <form.AppField
        name="visitedPerson"
        children={(field) => <field.TextField label="被走访人" labelCls="w-36 " required />}
      />

      <form.AppField
        name="visitedPersonPosition"
        children={(field) => <field.TextField label="被走访人职务" labelCls="w-36 " required />}
      />

      <form.AppField
        name="visitedPersonPhone"
        children={(field) => <field.TextField label="被走访人电话" labelCls="w-36 " required />}
      />

      <form.AppField
        name="visitSituation"
        children={(field) => <field.TextareaField label="走访内容" labelCls="w-36 required" />}
      />

      <Separator className="col-span-full my-2 border-gray-200" />

      <form.AppField
        name="hasCompanyDemand"
        children={(field) => <field.SwitchField label="是否有诉求" labelCls="w-36 required" />}
      />

      {hasDemand && (
        <>
          <form.AppField
            name="companyDemand"
            children={(field) => (
              <field.TextareaField label="企业诉求说明" labelCls="w-36 required" />
            )}
          />

          <form.AppField
            name="isCompleted"
            children={(field) => <field.SwitchField label="是否办结" labelCls="w-36 required" />}
          />

          {isCompleted && (
            <>
              <form.AppField
                name="completedDescription"
                children={(field) => (
                  <field.TextareaField label="办结情况" labelCls="w-36 required" />
                )}
              />

              <form.AppField
                name="completionTime"
                children={(field) => (
                  <field.DateTimeField label="办结时间" labelCls="w-48 required" />
                )}
              />
            </>
          )}
        </>
      )}

      <Separator className="col-span-full my-2 border-gray-200" />
      <form.AppForm>
        <form.SubmitButton label="提交" />
      </form.AppForm>
    </form>
  );
};
