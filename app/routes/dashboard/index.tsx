import { createFileRoute } from '@tanstack/react-router';
import { SidebarInset } from '~/components/ui/sidebar';

import { ChartAreaInteractive } from '~/components/modif_shadcn/chartarea-interactive';
import { SectionCards } from '~/components/modif_shadcn/section-cards';

import { BarChart02 } from '~/components/modif_shadcn/bar-chart';
import { BarChartNeg } from '~/components/modif_shadcn/bar-chart-negative';
import { PieChartSelector } from '~/components/modif_shadcn/pie-chart';

export const Route = createFileRoute('/dashboard/')({
  component: DashMain,
});

function DashMain() {
  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <SectionCards />
        <div className="w-full grid lg:grid-cols-3 gap-4 p-4">
          <BarChartNeg className="" />
          <BarChart02 className="" />
          <PieChartSelector className="" />
        </div>
        <ChartAreaInteractive />
      </div>
    </SidebarInset>
  );
}
