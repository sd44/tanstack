'use client';
import { toast } from 'sonner';
import { Separator } from '~/components/ui/separator';
import { useAppForm } from '~/hooks/form';
import hangye2017 from '~/lib/data/hangye2017.json' with { type: 'json' };
import { handleCompsForm } from '~/lib/db/handle-company';
import { type enterprisesInserT, enterprisesInsertSchema } from '~/lib/db/schema';
import { logger } from '~/lib/pino-logger';

export const CompanyForm = () => {
  const form = useAppForm({
    defaultValues: {} as enterprisesInserT,
    validators: {
      onChange: enterprisesInsertSchema,
    },
    onSubmit: async ({ value }) => {
      logger.warn({ 'CompanyForm Submit Value': value });
      const msg = await handleCompsForm({ data: value });
      if (msg.success) {
        form.reset();
        toast.success('提交成功，恭喜你！');
      } else {
        toast.error(msg.error);
      }
    },
  });

  return (
    <form
      className="mx-8 grid grid-cols-1 gap-x-8 gap-y-4 md:mx-8 md:grid-cols-2 lg:grid-cols-3"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.AppField name="companyName">
        {(field) => (
          <field.TextField label="企业名称" labelCls="w-36" placeholder="与营业执照一致" required />
        )}
      </form.AppField>
      <form.AppField name="address">
        {(field) => (
          <field.TextField label="详细地址" labelCls="w-36" placeholder="与营业执照一致" required />
        )}
      </form.AppField>

      <form.AppField name="legalPersonName">
        {(field) => (
          <field.TextField
            label="法定代表人姓名"
            labelCls="w-48"
            placeholder="与营业执照一致"
            required
          />
        )}
      </form.AppField>
      <form.AppField name="legalPersonPhone">
        {(field) => <field.TextField label="法定代表人手机" labelCls="w-48" required />}
      </form.AppField>

      <form.AppField name="contactPerson">
        {(field) => <field.TextField label="联系人姓名" labelCls="w-48" />}
      </form.AppField>

      <form.AppField name="contactPersonPhone">
        {(field) => <field.TextField label="联系人手机" labelCls="w-48" />}
      </form.AppField>

      <Separator className="col-span-full my-2 border-gray-200" />

      <form.AppField name="companySize">
        {(field) => (
          <field.SelectField
            items={['特大型', '大型', '中型', '小型', '微型']}
            label="企业规模"
            labelCls="w-48 after:ml-0.5 after:text-red-500 after:content-['*'] after:text-lg required"
          />
        )}
      </form.AppField>
      <form.AppField name="registeredCapital">
        {(field) => (
          <field.TextField label="注册资本(万元)" labelCls="w-48" required type="number" />
        )}
      </form.AppField>

      <form.AppField name="employeeCount">
        {(field) => <field.TextField label="员工人数" labelCls="w-48" required type="number" />}
      </form.AppField>

      <form.AppField name="businessStatus">
        {(field) => (
          <field.SelectField
            items={['正常', '异常']}
            label="生产经营状况"
            labelCls="w-48 after:ml-0.5 after:text-red-500 after:content-['*'] after:text-lg required"
          />
        )}
      </form.AppField>

      <form.AppField name="industryCategory">
        {(field) => (
          <field.SelectField
            items={['第一产业', '第二产业', '第三产业']}
            label="三大产业"
            labelCls="w-48 after:ml-0.5 after:text-red-500 after:content-['*'] after:text-lg required"
          />
        )}
      </form.AppField>

      <form.AppField name="industryCode">
        {(field) => (
          <field.CascaderField
            labelCls="w-48 after:ml-0.5 after:text-red-500 after:content-['*'] after:text-lg required"
            labelStr="行业分类"
            options={hangye2017}
          />
        )}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton label="提交" />
      </form.AppForm>
    </form>
  );
};
