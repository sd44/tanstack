import { createFileRoute } from '@tanstack/react-router';

import { VisitForm } from '~/components/myui/visit-form';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { fetchMyComps } from '~/lib/db/CRUD/visit-datas';
import type { visitInsertT } from '~/lib/db/schema';

export const Route = createFileRoute('/dashboard/new-visit')({
  component: RouteComponent,
  beforeLoad: async () => ({ comps: await fetchMyComps(), crumb: '新增走访记录' }),
});

function RouteComponent() {
  return (
    <div className="m-auto">
      <DialogDemo />
    </div>
  );
}

export function DialogDemo() {
  const mydefaultValues = {
    companyName: '',
    visitTime: new Date(),
    visitedPerson: '',
    visitedPersonPosition: '',
    visitedPersonPhone: '',
    visitSituation: '',
    hasCompanyDemand: false,
    companyDemand: '',
    isCompleted: true,
    completedDescription: '',
    remarkInformation: '',
    completionTime: null,
    completionPersonName: '',
    completionRemark: '',
  } as visitInsertT;

  const comps = Route.useRouteContext().comps || [];
  console.log('comps', comps);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>新增走访记录</Button>
      </DialogTrigger>
      <DialogContent className="!max-w-5xl !h-[85vh] m-auto overflow-auto">
        <DialogHeader>
          <DialogTitle>新增走访记录</DialogTitle>
          <DialogDescription>填写走访记录，请确保信息准确无误。</DialogDescription>
        </DialogHeader>
        <VisitForm comps={comps} defaultValues={mydefaultValues} />
      </DialogContent>
    </Dialog>
  );
}
