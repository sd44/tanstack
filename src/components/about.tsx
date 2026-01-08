import { Link } from '@tanstack/react-router';
import { CheckCircleIcon } from 'lucide-react';
// import { ThemeToggle } from '~/components/theme-toggle';
import { Button } from '~/components/ui/button';

const tiers = [
  {
    name: '本站开发理念',
    id: 'tier-growth',
    description: '安全高效，简洁易用，KISS',
    features: ['网络安全第一位', '不信任云服务商', '业务需求为基础', 'Keep It Simple & Stupid'],
  },
  {
    name: '后端技术栈',
    id: 'tier-basic',
    description: '客户体验优先于开发者舒适',
    features: [
      'Tanstack React 全栈框架',
      '优先服务端渲染 SSR',
      'Better Auth 用户认证库',
      'Drizzle + PostgreSQL 数据库',
    ],
  },
  {
    name: '前端技术栈',
    id: 'tier-essential',
    description: '健壮灵活高定',
    features: [
      '移动优先的响应式设计',
      '手机、电脑等设备自适应',
      'Tailwind CSS',
      'Shadcn & Origin UI',
    ],
  },
];

export function About() {
  return (
    <div className="mx-auto mt-12 max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-7xl sm:text-center">
        <p className="mt-2 text-pretty font-semibold text-4xl text-indigo-600 tracking-tight sm:text-balance sm:text-4xl dark:text-violet-200">
          墨韩的梦园 —— 企业专员服务系统
        </p>
      </div>

      <div className="m-8 flex place-content-center justify-center gap-x-8">
        <Button asChild className="w-48">
          <Link to="/dashboard">管理面板</Link>
        </Button>

        {/* <ThemeToggle /> */}
      </div>
      <div className="mt-2 flow-root">
        <div className="isolate mx-auto mt-2 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div className="rounded-3xl border-4 p-4 ring-1 ring-gray-200 xl:p-6" key={tier.id}>
              <h3 className="font-semibold text-xl/loose" id={tier.id}>
                {tier.name}
              </h3>
              <p className="mt-2 font-semibold text-gray-600 text-md/6 dark:text-gray-200">
                {tier.description}
              </p>
              <ul className="mt-6 space-y-3 text-md/6">
                {tier.features.map((feature) => (
                  <li className="flex gap-x-3" key={feature}>
                    <CheckCircleIcon
                      aria-hidden="true"
                      className="h-6 w-5 flex-none text-indigo-600"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <p className="flex flex-col">本后台管理面板是我学习网站开发的阶段性成果展示</p>

        <p>网站建设交流请联系 25931014@qq.com</p>
      </div>
    </div>
  );
}
