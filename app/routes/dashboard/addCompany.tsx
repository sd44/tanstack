import { createFileRoute } from '@tanstack/react-router';
import { CompanyForm } from '~/components/myui/company-form';

export const Route = createFileRoute('/dashboard/addCompany')({
  component: AddCompany,
});

function AddCompany() {
  return (
    <div>
      <h3 className="m-8">新增企业信息</h3>
      <CompanyForm />
    </div>
  );
}
