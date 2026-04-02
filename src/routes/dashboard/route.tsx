import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { authQueryOptions } from '@/lib/auth/queries';
import { AppSidebar } from '@/components/modif_shadcn/app-sidebar';
import { SiteHeader } from '@/components/modif_shadcn/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,

  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authQueryOptions());
    if (!user) {
      throw redirect({ to: '/login' });
    }
    return { user, crumb: '管理面板' };
  },

  loader: ({ context }) => {
    return { user: context.user, crumb: '管理面板' };
  },
});

function DashboardLayout() {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <Outlet />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
