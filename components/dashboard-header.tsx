'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export function DashboardHeader() {
  return (
    <header className="flex h-14 items-center gap-2 border-b px-4 md:hidden">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />
      <span className="text-sm font-semibold">Molinar Business</span>
    </header>
  );
}
