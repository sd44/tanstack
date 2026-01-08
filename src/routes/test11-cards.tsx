import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/test11-cards')({
  component: RouteComponent,
});

interface CardCon {
  title: string;
  subtitle: string;
  desc: string;
  image: string;
}

function CardElem({ title, subtitle, desc, image }: CardCon) {
  return (
    <div className="relative flex h-full flex-col flex-wrap rounded-[calc(var(--radius-lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
      <img alt={title} className="h-80 object-cover object-center" src={image} />
      <div className="pt-4">
        <h4 className="font-semibold text-indigo-600">{title}</h4>
        <p className="mt-2 font-medium text-base text-gray-950 tracking-tight">{subtitle}</p>
        <p className="mt-2 max-w-lg text-gray-600 text-sm/6">{desc}</p>
      </div>
    </div>
  );
}

const myContents: CardCon[] = [
  {
    title: '私密心理测评咨询',
    subtitle: '科学评估心理状态，专业定制成长方案',
    desc: '专业心理测评工具，帮助全面了解自我心理状况，提供针对性咨询建议',
    image: '/lixin/zixun.jpg',
  },
  {
    title: '心理沙盘游戏',
    subtitle: '在沙的世界里，遇见本我他我',
    desc: '2000余沙具共您选择，不限年龄，可团体可个人',
    image: '/lixin/shapan.png',
  },
  {
    title: 'OH卡牌治愈',
    subtitle: '打开潜意识之门，照进内心世界',
    desc: '促进自我觉察、协助突破个人困境，获得未来方向启发',
    image: '/lixin/ohcard.jpg',
  },
  {
    title: '青少年家教和心理',
    subtitle: '不只是孩子的成长，更是父母的修行',
    desc: '专业引导青少年心理健康，并提供父母沟通技巧，化解亲子冲突，促进家庭和谐',
    image: '/lixin/young.jpg',
  },
];

function RouteComponent() {
  return (
    <div className="m-auto mx-8 grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
      {myContents.map((item) => CardElem(item))}
    </div>
  );
}
