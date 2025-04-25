import {
  /* BookOpen, */
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  /* Settings2, */
  SquareTerminal,
} from 'lucide-react';
import * as React from 'react';

import { useRouteContext } from '@tanstack/react-router';
import { NavMain } from '~/components/modif_shadcn/nav-main';
/* import { NavProjects } from '~/components/modif_shadcn/nav-projects'; */
import { NavSecondary } from '~/components/modif_shadcn/nav-secondary';
import { NavUser } from '~/components/modif_shadcn/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';

const data = {
  navMain: [
    {
      title: '企业信息',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: '新增企业信息',
          url: '/dashboard/addCompany',
        },
        {
          title: '企业信息列表',
          url: '/dashboard/listCop',
        },
      ],
    },
    {
      title: '走访记录',
      url: '#',
      icon: Bot,
      isActive: true,
      items: [
        {
          title: '新增走访记录',
          url: '/dashboard/newVisit',
        },
        {
          title: '历史走访记录',
          url: '/dashboard/historyVisit',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: '项目源代码',
      url: 'https://gitee.com/sd44/tanstack',
      icon: LifeBuoy,
    },
    {
      title: '问题反馈',
      url: 'https://gitee.com/sd44/tanstack/issues',
      icon: Send,
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useRouteContext({ from: '/dashboard' }).user;
  const userdata = {
    name: user!.name,
    email: user!.email,
    avatar: user!.image ?? '/ico/avatar.png',
  };

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-bold">墨韩的梦园</span>
                  <span className="truncate text-sm">蛋疼的蛋蛋</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userdata} />
      </SidebarFooter>
    </Sidebar>
  );
}
