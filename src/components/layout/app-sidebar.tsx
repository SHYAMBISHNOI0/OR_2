'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Hospital,
  PieChart,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useOrchestrate } from '@/context/orchestrate-context';

const navItems = [
  { href: '/patient', icon: Users, label: 'Patient View' },
  { href: '/admin', icon: PieChart, label: 'Admin View' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { requests } = useOrchestrate();
  const pendingRequestsCount = requests.filter(r => r.status === 'Pending').length;

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Hospital className="h-6 w-6 text-primary" />
            <span className="">Orchestrate</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8 relative">
            <Bell className="h-4 w-4" />
            {pendingRequestsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {pendingRequestsCount}
                </span>
            )}
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname.startsWith(item.href) && 'bg-muted text-primary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Need Assistance?</CardTitle>
              <CardDescription>
                Contact support for help with the system or technical issues.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
