import { createFileRoute } from '@tanstack/react-router';
import { Quote } from 'lucide-react';
import { Card, CardContent, CardHeader } from '~/components/ui/card';

export const Route = createFileRoute('/test13-customers')({
  component: Feedbacks,
});

function Feedbacks() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h2 className="mb-8 text-center font-semibold text-4xl text-gray-900 tracking-tight sm:text-5xl md:mb-12">
        来访者反馈
      </h2>
      <div className="max-w-7xl gap-8 px-4 sm:px-6 md:columns-2 lg:columns-3 lg:px-8">
        {msgs.map((item) => (
          <TestimonialCard {...item} key={item.name} />
        ))}
      </div>
    </div>
  );
}

type feedBack = {
  name: string;
  avatar?: string;
  msg: string;
};

function TestimonialCard({ name, msg }: feedBack) {
  return (
    <Card className="relative mb-8 w-full max-w-sm break-inside-avoid border-2 bg-gray-50 shadow-none">
      <Quote className="absolute top-3 right-2 h-8 w-8 stroke-[2px] text-foreground/50" />
      <CardHeader>
        <div className="flex items-center gap-3">
          {/* Avatar placeholder - uncomment and style if you add avatar data
          {avatar && <img src={avatar} alt={name} className="h-10 w-10 rounded-full" />}
          */}
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-lg leading-none"> {name} </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-base text-muted-foreground">{msg}</p>
      </CardContent>
    </Card>
  );
}

const msgs: feedBack[] = [
  {
    name: '30岁职场女性，焦虑情绪管理',
    msg: '在韩老师这里做了7次咨询，终于明白我的焦虑不是‘矫情’。每次都能被精准理解，她教我用的‘情绪暂停键’方法太实用了！现在能更加从容应对工作，连同事都说我整个人松弛了很多。',
  },
  {
    name: '青春期亲子关系',
    msg: '孩子拒绝沟通半年，没想到沙盘游戏让他开口了，第一次听到他说“其实我知道妈妈很累”时直接泪崩了…现在每周茶话会成了我家的固定节目。',
  },
  {
    name: '大学生，人际关系困扰',
    msg: '本来以为心理咨询就是被说教，但韩老师完全不会给答案，而是通过游戏、谈话使我发现自己的互动模式。现在我更加接受自己的不完美，反而和室友关系好多了……',
  },
  {
    name: '新手父母育儿冲突',
    msg: '夫妻俩差点因为带孩子的问题闹离婚，韩老师没有偏袒任何一方，而是带我们看到彼此童年的影响。现在我们会用OH 卡牌游戏沟通，孩子哭闹时反而成了我们的合作时刻。',
  },
  {
    name: '反客为主',
    msg: '同闺蜜参加了两次团体沙盘，原本只是怕她一人尴尬才来陪玩，结果反倒发现了自己内心的缺失😭……',
  },
];
