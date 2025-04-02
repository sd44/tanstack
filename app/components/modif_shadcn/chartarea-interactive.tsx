import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group';
import { useIsMobile } from '~/hooks/use-mobile';
const chartData = [
  { date: '2025-01-01', desktop: 222, mobile: 150 },
  { date: '2025-01-02', desktop: 97, mobile: 180 },
  { date: '2025-01-03', desktop: 167, mobile: 120 },
  { date: '2025-01-04', desktop: 242, mobile: 260 },
  { date: '2025-01-05', desktop: 373, mobile: 290 },
  { date: '2025-01-06', desktop: 301, mobile: 340 },
  { date: '2025-01-07', desktop: 245, mobile: 180 },
  { date: '2025-01-08', desktop: 409, mobile: 320 },
  { date: '2025-01-09', desktop: 59, mobile: 110 },
  { date: '2025-01-10', desktop: 261, mobile: 190 },
  { date: '2025-01-11', desktop: 327, mobile: 350 },
  { date: '2025-01-12', desktop: 292, mobile: 210 },
  { date: '2025-01-13', desktop: 342, mobile: 380 },
  { date: '2025-01-14', desktop: 137, mobile: 220 },
  { date: '2025-01-15', desktop: 120, mobile: 170 },
  { date: '2025-01-16', desktop: 138, mobile: 190 },
  { date: '2025-01-17', desktop: 446, mobile: 360 },
  { date: '2025-01-18', desktop: 364, mobile: 410 },
  { date: '2025-01-19', desktop: 243, mobile: 180 },
  { date: '2025-01-20', desktop: 89, mobile: 150 },
  { date: '2025-01-21', desktop: 137, mobile: 200 },
  { date: '2025-01-22', desktop: 224, mobile: 170 },
  { date: '2025-01-23', desktop: 138, mobile: 230 },
  { date: '2025-01-24', desktop: 387, mobile: 290 },
  { date: '2025-01-25', desktop: 215, mobile: 250 },
  { date: '2025-01-26', desktop: 75, mobile: 130 },
  { date: '2025-01-27', desktop: 383, mobile: 420 },
  { date: '2025-01-28', desktop: 122, mobile: 180 },
  { date: '2025-01-29', desktop: 315, mobile: 240 },
  { date: '2025-01-30', desktop: 454, mobile: 380 },
  { date: '2025-01-31', desktop: 212, mobile: 198 },
  { date: '2025-02-01', desktop: 165, mobile: 220 },
  { date: '2025-02-02', desktop: 293, mobile: 310 },
  { date: '2025-02-03', desktop: 247, mobile: 190 },
  { date: '2025-02-04', desktop: 385, mobile: 420 },
  { date: '2025-02-05', desktop: 481, mobile: 390 },
  { date: '2025-02-06', desktop: 498, mobile: 520 },
  { date: '2025-02-07', desktop: 388, mobile: 300 },
  { date: '2025-02-08', desktop: 149, mobile: 210 },
  { date: '2025-02-09', desktop: 227, mobile: 180 },
  { date: '2025-02-10', desktop: 293, mobile: 330 },
  { date: '2025-02-11', desktop: 335, mobile: 270 },
  { date: '2025-02-12', desktop: 197, mobile: 240 },
  { date: '2025-02-13', desktop: 197, mobile: 160 },
  { date: '2025-02-14', desktop: 448, mobile: 490 },
  { date: '2025-02-15', desktop: 473, mobile: 380 },
  { date: '2025-02-16', desktop: 338, mobile: 400 },
  { date: '2025-02-17', desktop: 499, mobile: 420 },
  { date: '2025-02-18', desktop: 315, mobile: 350 },
  { date: '2025-02-19', desktop: 235, mobile: 180 },
  { date: '2025-02-20', desktop: 177, mobile: 230 },
  { date: '2025-02-21', desktop: 82, mobile: 140 },
  { date: '2025-02-22', desktop: 81, mobile: 120 },
  { date: '2025-02-23', desktop: 252, mobile: 290 },
  { date: '2025-02-24', desktop: 294, mobile: 220 },
  { date: '2025-02-25', desktop: 201, mobile: 250 },
  { date: '2025-02-26', desktop: 213, mobile: 170 },
  { date: '2025-02-27', desktop: 420, mobile: 460 },
  { date: '2025-02-28', desktop: 233, mobile: 190 },
  { date: '2025-03-01', desktop: 178, mobile: 200 },
  { date: '2025-03-02', desktop: 470, mobile: 410 },
  { date: '2025-03-03', desktop: 103, mobile: 160 },
  { date: '2025-03-04', desktop: 439, mobile: 380 },
  { date: '2025-03-05', desktop: 88, mobile: 140 },
  { date: '2025-03-06', desktop: 294, mobile: 250 },
  { date: '2025-03-07', desktop: 323, mobile: 370 },
  { date: '2025-03-08', desktop: 385, mobile: 320 },
  { date: '2025-03-09', desktop: 438, mobile: 480 },
  { date: '2025-03-10', desktop: 155, mobile: 200 },
  { date: '2025-03-11', desktop: 92, mobile: 150 },
  { date: '2025-03-12', desktop: 492, mobile: 420 },
  { date: '2025-03-13', desktop: 81, mobile: 130 },
  { date: '2025-03-14', desktop: 426, mobile: 380 },
  { date: '2025-03-15', desktop: 307, mobile: 350 },
  { date: '2025-03-16', desktop: 371, mobile: 310 },
  { date: '2025-03-17', desktop: 475, mobile: 520 },
  { date: '2025-03-18', desktop: 107, mobile: 170 },
  { date: '2025-03-19', desktop: 341, mobile: 290 },
  { date: '2025-03-20', desktop: 408, mobile: 450 },
  { date: '2025-03-21', desktop: 169, mobile: 210 },
  { date: '2025-03-22', desktop: 317, mobile: 270 },
  { date: '2025-03-23', desktop: 480, mobile: 530 },
  { date: '2025-03-24', desktop: 132, mobile: 180 },
  { date: '2025-03-25', desktop: 141, mobile: 190 },
  { date: '2025-03-26', desktop: 434, mobile: 380 },
  { date: '2025-03-27', desktop: 448, mobile: 490 },
  { date: '2025-03-28', desktop: 149, mobile: 200 },
  { date: '2025-03-29', desktop: 103, mobile: 160 },
  { date: '2025-03-30', desktop: 446, mobile: 400 },
  { date: '2025-03-31', desktop: 480, mobile: 432 },
];

const chartConfig = {
  visitors: {
    label: '访问者',
  },
  desktop: {
    label: '桌面',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: '手机',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  const lastDate: Date = chartData.length
    ? new Date(chartData[chartData.length - 1].date)
    : new Date('2025-03-31');

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = lastDate;
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>访问设备统计（演示）</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">最近三个月数据</span>
          <span className="@[540px]/card:hidden">最近三个月</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden">
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              最近 3 个月
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              最近 30 天
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              最近 7 天
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="@[767px]/card:hidden flex w-40" aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('zh-CN', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
