import { useStore } from '@tanstack/react-store';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Separator } from '~/components/ui/separator';
import { useAppForm } from '~/hooks/form';
import { visitInsertPlusSchema, type visitInsertT, visitTypeEnum } from '~/lib/db/schema';

export const VisitForm = ({
  comps,
  defaultValues,
  isUpdate = false,
  onSubmit,
}: {
  comps: string[];
  defaultValues: visitInsertT;
  isUpdate?: boolean;
  onSubmit: (value: visitInsertT) => Promise<void>;
}) => {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: visitInsertPlusSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await onSubmit(value);
        toast.success(isUpdate ? '更新成功' : '提交成功');
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          toast.error(error as string);
        }
      }
    },
  });

  const hasDemand = useStore(form.store, (state) => state.values.hasCompanyDemand);
  const isCompleted = useStore(form.store, (state) => state.values.isCompleted);

  useEffect(() => {
    if (!hasDemand) {
      form.resetField('companyDemand');
      form.resetField('isCompleted');
      form.resetField('completedDescription');
      form.resetField('completionTime');
    }

    if (!isCompleted) {
      form.resetField('completedDescription');
      form.resetField('completionTime');
    }
  }, [hasDemand, isCompleted, form]);

  // TODO: var my username company list
  return (
    <form
      className="mx-8 grid grid-cols-1 gap-x-6 gap-y-2 md:mx-8 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.AppField name="companyName">
        {(field) => <field.SelectField items={comps} label="企业名称" labelCls="w-36 required" />}
      </form.AppField>

      <form.AppField name="visitTime">
        {(field) => <field.DateTimeField label="走访时间" labelCls="w-48 required" />}
      </form.AppField>

      <Separator className="col-span-full border-gray-200" />

      <div className="col-span-full grid grid-cols-3 gap-x-2">
        <form.AppField name="visitedPerson">
          {(field) => <field.TextField label="被走访人" labelCls="w-36 " required />}
        </form.AppField>

        <form.AppField name="visitedPersonPosition">
          {(field) => <field.TextField label="被走访人职务" labelCls="w-44 " required />}
        </form.AppField>

        <form.AppField name="visitedPersonPhone">
          {(field) => <field.TextField label="被走访人电话" labelCls="w-44 " required />}
        </form.AppField>
      </div>

      <form.AppField name="visitType">
        {(field) => (
          <field.SelectField
            items={visitTypeEnum.map((item) => item)}
            label="走访类型"
            labelCls="w-36 after:ml-0.5 after:text-red-500 after:content-['*'] after:text-lg required"
          />
        )}
      </form.AppField>

      <form.AppField name="visitSituation">
        {(field) => <field.TextareaField label="走访内容" labelCls="w-36 " />}
      </form.AppField>

      <Separator className="col-span-full border-gray-200" />

      <form.AppField name="hasCompanyDemand">
        {(field) => <field.SwitchField label="是否有诉求" labelCls="w-36 required" />}
      </form.AppField>

      {hasDemand && (
        <>
          <form.AppField name="companyDemand">
            {(field) => <field.TextareaField label="企业诉求说明" labelCls="w-36 required" />}
          </form.AppField>

          <form.AppField name="isCompleted">
            {(field) => <field.SwitchField label="是否办结" labelCls="w-36 required" />}
          </form.AppField>

          {isCompleted && (
            <>
              <form.AppField name="completedDescription">
                {(field) => <field.TextareaField label="办结情况" labelCls="w-36 required" />}
              </form.AppField>

              <form.AppField name="completionTime">
                {(field) => <field.DateTimeField label="办结时间" labelCls="w-48 required" />}
              </form.AppField>
            </>
          )}
        </>
      )}

      <Separator className="col-span-full border-gray-200" />
      <form.AppForm>
        <form.SubmitButton label={isUpdate ? '更新' : '提交'} />
      </form.AppForm>
    </form>
  );
};
