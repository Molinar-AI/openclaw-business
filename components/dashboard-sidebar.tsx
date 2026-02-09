'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from '@/components/ui/sidebar';
import { LayoutDashboard, Plus, LogOut, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardSidebarProps {
  organization: { organization_name: string };
  member: { email_address: string };
}

export function DashboardSidebar({ organization, member }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'New Instance', href: '/dashboard/instances/new', icon: Plus },
    { title: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border">
            <img src="/molinar-logo.svg" alt="Molinar" className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Molinar</p>
            <p className="text-xs text-muted-foreground">{organization.organization_name}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground truncate flex-1">{member.email_address}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={handleLogout}
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
