import { Outlet, createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { AppSidebar } from '~/components/modif_shadcn/app-sidebar';
import { SiteHeader } from '~/components/modif_shadcn/site-header';
import { SidebarProvider } from '~/components/ui/sidebar';

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,

  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/auth/login' });
    }
  },

  // TODO: 应该根据context就需要获取用户。如此，则可以删掉loader.
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function DashboardLayout() {
  const { user } = Route.useLoaderData();
  const router = useRouter();

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />

          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
}
