'use client';
import { toast } from 'sonner';
import { Separator } from '~/components/ui/separator';
import { useAppForm } from '~/hooks/form';
import hangye2017 from '~/lib/data/hangye2017.json';
import { companyOpts, companySchema } from '~/utils/company-isomophic';
import { handleForm } from '~/utils/company-server';

export const CompanyForm = () => {
  const form = useAppForm({
    ...companyOpts,
    validators: {
      onChange: companySchema,
    },
    onSubmit: async ({ value }) => {
      alert(JSON.stringify(value, null, 2));
      // call serverfn handleForm
      const msg = await handleForm({ data: value });

      console.log('插入信息：', msg);
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
      }}>
      <form.AppField
        name="companyName"
        children={(field) => (
          <field.TextField label="企业名称" labelCls="w-36" required placeholder="与营业执照一致" />
        )}
      />
      <form.AppField
        name="address"
        children={(field) => (
          <field.TextField label="详细地址" labelCls="w-36" required placeholder="与营业执照一致" />
        )}
      />

      <Separator className="col-span-full my-2 border-gray-200" />

      <form.AppField
        name="legalPersonName"
        children={(field) => (
          <field.TextField
            label="法定代表人姓名"
            labelCls="w-48"
            placeholder="与营业执照一致"
            required
          />
        )}
      />
      <form.AppField
        name="legalPersonPhone"
        children={(field) => <field.TextField label="法定代表人手机" labelCls="w-48" required />}
      />

      <Separator className="col-span-full my-2 border-gray-200" />

      <form.AppField
        name="contactPerson"
        children={(field) => <field.TextField label="联系人姓名" labelCls="w-48" />}
      />
      <form.AppField
        name="contactPersonPhone"
        children={(field) => <field.TextField label="联系人手机" labelCls="w-48" />}
      />

      <Separator className="col-span-full my-2 border-gray-200" />

      <form.AppField
        name="companySize"
        children={(field) => (
          <field.SelectField
            label="企业规模"
            labelCls="w-48 after:ml-0.5 after:text-red-500 after:content-['*'] after:text-lg"
            items={['特大型', '大型', '中型', '小型', '微型']}
            required
          />
        )}
      />
      <form.AppField
        name="registeredCapital"
        children={(field) => (
          <field.TextField label="注册资本(万元)" labelCls="w-48" type="number" required />
        )}
      />

      <form.AppField
        name="employeeCount"
        children={(field) => (
          <field.TextField label="员工人数" labelCls="w-48" type="number" required />
        )}
      />

      <form.AppField
        name="businessStatus"
        children={(field) => (
          <field.SelectField
            label="生产经营状况"
            labelCls="w-48 after:ml-0.5 after:text-red-500 after:content-['*'] after:text-lg"
            items={['正常', '异常']}
            required
          />
        )}
      />

      <form.AppField
        name="industryCategory"
        children={(field) => (
          <field.SelectField
            label="三大产业"
            labelCls="w-48 after:ml-0.5 after:text-red-500 after:content-['*'] after:text-lg"
            items={['第一产业', '第二产业', '第三产业']}
            required
          />
        )}
      />

      <form.AppField
        name="industryCode"
        children={(field) => (
          <field.CascaderField
            label="行业分类"
            labelCls="w-48 after:ml-0.5 after:text-red-500 after:content-['*'] after:text-lg"
            options={hangye2017}
            required
          />
        )}
      />
      <form.AppForm>
        <form.SubmitButton label="提交" />
      </form.AppForm>
    </form>
  );
};
