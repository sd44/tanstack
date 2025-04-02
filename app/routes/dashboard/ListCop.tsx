import { createFileRoute } from '@tanstack/react-router';
import { CompanyForm } from '~/components/myui/company-form';

export const Route = createFileRoute('/dashboard/ListCop')({
  component: AddCompany,
});

function AddCompany() {
  return (
    <div>
      <h3 className="m-8">企业信息列表</h3>
      <CompanyForm />
    </div>
  );
}
