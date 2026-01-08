import { createFileRoute } from '@tanstack/react-router';
import { CompanyForm } from '~/components/myui/company-form';

export const Route = createFileRoute('/dashboard/add-company')({
  component: AddCompany,
  loader: () => ({
    crumb: '新增企业信息',
  }),
});

function AddCompany() {
  return (
    <div className="mx-4 flex flex-col gap-2 overflow-auto p-2">
      <h3>新增企业信息</h3>
      <CompanyForm />
    </div>
  );
}
