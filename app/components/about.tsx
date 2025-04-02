import { Link } from '@tanstack/react-router';
import { CheckCircleIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';

import ThemeToggle from '~/components/ThemeToggle';

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
      'Better Auth 用户验证库',
      'PostgreSQL 数据库',
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
      'Origin & Ant Design UI',
    ],
  },
];

export function About() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-12">
      <div className="mx-auto max-w-7xl sm:text-center">
        <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-indigo-600 dark:text-violet-200 sm:text-4xl sm:text-balance">
          墨韩的梦园 —— 企业专员服务系统
        </p>
      </div>

      <div className="m-8 flex justify-center place-content-center">
        <Button className="w-64">
          <Link to="/dashboard">管理面板</Link>
        </Button>

        <ThemeToggle />
      </div>
      <div className="mt-2 flow-root">
        <div className="isolate mx-auto mt-2 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.id} className="ring-gray-200 rounded-3xl p-4 ring-1 xl:p-6  border-4">
              <h3 id={tier.id} className="text-xl/loose font-semibold">
                {tier.name}
              </h3>
              <p className="text-md/6 mt-2 font-semibold text-gray-600 dark:text-gray-200">
                {tier.description}
              </p>
              <ul role="list" className="text-md/6 mt-6 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
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
