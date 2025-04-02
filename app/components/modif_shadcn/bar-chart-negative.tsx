'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart';
const chartData = [
  { month: '一月', visitors: 186 },
  { month: '二月', visitors: 205 },
  { month: '三月', visitors: -207 },
  { month: '四月', visitors: 173 },
  { month: '五月', visitors: -209 },
  { month: '六月', visitors: 214 },
  { month: '七月', visitors: 86 },
  { month: '八月', visitors: 305 },
  { month: '九月', visitors: -107 },
  { month: '十月', visitors: 193 },
  { month: '十一月', visitors: -159 },
  { month: '十二月', visitors: 274 },
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
} satisfies ChartConfig;

export function BarChartNeg() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>柱形图-带负数（演示用）</CardTitle>
        <CardDescription>2024年目标完成情况</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar dataKey="visitors">
              <LabelList position="top" dataKey="month" fillOpacity={1} />
              {chartData.map((item) => (
                <Cell
                  key={item.month}
                  fill={item.visitors > 0 ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))'}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          本月较上月上升X.XX% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">2024年月度完成情况</div>
      </CardFooter>
    </Card>
  );
}
