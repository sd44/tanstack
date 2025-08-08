import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4 lg:px-6 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>本月注册用户</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            365 人
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Badge className="flex gap-1 rounded-lg text-base" variant="outline">
              <TrendingUpIcon className="size-6" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            较上月增长明显 <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">演示用伪数据</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>本月录入企业</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            1,234 家
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Badge className="flex gap-1 rounded-lg text-base" variant="outline">
              <TrendingDownIcon className="size-6" />
              -20%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            本季度下降 20% <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">演示用伪数据</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>本月反馈问题</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            123 条
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Badge className="flex gap-1 rounded-lg text-base" variant="outline">
              <TrendingUpIcon className="size-6" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            较上月增长 12.5% <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">演示用伪数据</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>本月解决问题</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            100%
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Badge className="flex gap-1 rounded-lg text-base" variant="outline">
              <TrendingUpIcon className="w-16" />
              0%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            没有任何遗留问题
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">演示用伪数据 </div>
        </CardFooter>
      </Card>
    </div>
  );
}
