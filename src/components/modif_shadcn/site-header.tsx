import { isMatch, Link, useMatches } from '@tanstack/react-router';
import { SidebarIcon } from 'lucide-react';
import { ThemeToggle } from '~/components/theme-toggle';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { useSidebar } from '~/components/ui/sidebar';

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  const matches = useMatches();
  if (matches.some((match) => match.status === 'pending')) return null;

  const matchesWithCrumbs = matches.filter((match) => isMatch(match, 'loaderData.crumb'));

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button className="h-8 w-8" onClick={toggleSidebar} size="icon" variant="ghost">
          <SidebarIcon />
        </Button>
        <Separator className="mr-2 h-4" orientation="vertical" />

        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {matchesWithCrumbs.map((match, i) => {
              return (
                <div className="flex gap-2" key={match.id}>
                  <BreadcrumbItem>
                    <Link from={match.fullPath}>{match.loaderData?.crumb}</Link>
                  </BreadcrumbItem>
                  {i + 1 < matchesWithCrumbs.length ? <BreadcrumbSeparator /> : null}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        {/* <SearchForm className="sm:ml-auto w-full sm:w-auto" /> */}
        <div className="w-full sm:ml-auto sm:w-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
