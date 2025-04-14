import { SidebarIcon } from 'lucide-react';

import { Link, useMatches, isMatch } from '@tanstack/react-router';
import { SearchForm } from '~/components/modif_shadcn/search-form';
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
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {matchesWithCrumbs.map((match, i) => {
              return (
                <div key={match.id} className="flex gap-2">
                  <BreadcrumbItem>
                    <Link from={match.fullPath}>{match.loaderData?.crumb}</Link>
                  </BreadcrumbItem>
                  {i + 1 < matchesWithCrumbs.length ? <BreadcrumbSeparator /> : null}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
      </div>
    </header>
  );
}
