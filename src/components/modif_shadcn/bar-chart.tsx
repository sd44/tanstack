'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart';

const chartData = [
  { person: '王二', score: 237 },
  { person: '张三', score: 186 },
  { person: '李四', score: 305 },
  { person: '赵五', score: 73 },
  { person: '老六', score: 209 },
  { person: '老七', score: 314 },
  { person: '老八', score: 34 },
  { person: '老九', score: 124 },
];

const chartConfig = {
  score: {
    label: '走访量',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function BarChart02() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>带标签柱状图（演示用）</CardTitle>
        <CardDescription>每人走访企业次数</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              className="font-bold text-base"
              dataKey="person"
              tickFormatter={(value) => value.slice(0, 3)}
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
            <Bar dataKey="score" fill="var(--color-score)" radius={8}>
              <LabelList className="fill-foreground" fontSize={12} offset={12} position="top" />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          走访企业数量较去年同期上升 5.2% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">2025年上半年企业走访数量统计</div>
      </CardFooter>
    </Card>
  );
}
