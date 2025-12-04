'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  CalendarCheck, 
  Award, 
  CheckSquare, 
  LogOut 
} from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[]; // Roles that can see this link
}

export function SidebarNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks: NavLink[] = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      href: '/employees',
      label: 'Employees',
      icon: <Users className="mr-2 h-4 w-4" />,
      roles: ['HR_ADMIN', 'SUPER_ADMIN'],
    },
    {
      href: '/payroll',
      label: 'Payroll',
      icon: <DollarSign className="mr-2 h-4 w-4" />,
      roles: ['HR_ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'],
    },
    {
      href: '/attendance',
      label: 'Attendance',
      icon: <CalendarCheck className="mr-2 h-4 w-4" />,
      roles: ['HR_ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'],
    },
    {
      href: '/kpi',
      label: 'KPI',
      icon: <Award className="mr-2 h-4 w-4" />,
      roles: ['HR_ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'],
    },
    {
      href: '/approvals',
      label: 'Approvals',
      icon: <CheckSquare className="mr-2 h-4 w-4" />,
      roles: ['HR_ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'],
    },
  ];

  const filteredNavLinks = navLinks.filter(link => {
    if (!link.roles) return true; // Always show if no roles specified
    return user && link.roles.includes(user.role);
  });

  return (
    <nav className="flex flex-col space-y-1 p-4">
      {filteredNavLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
            pathname === link.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
          )}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
      <Button onClick={logout} variant="ghost" className="mt-4 flex items-center justify-start text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </nav>
  );
}
