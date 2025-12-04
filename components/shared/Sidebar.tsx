'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Briefcase, CheckSquare, Calendar, BarChart2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/employees', label: 'Employees', icon: Users },
  { href: '/payroll', label: 'Payroll', icon: Briefcase },
  { href: '/approval', label: 'Approvals', icon: CheckSquare },
  { href: '/attendance', label: 'Attendance', icon: Calendar },
  { href: '/kpi', label: 'KPI', icon: BarChart2 },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <Card className="h-screen w-64 flex-col justify-between overflow-y-auto border-r bg-gray-50 p-4 hidden md:flex">
      <div>
        <div className="mb-8 flex items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-gray-800">HR System</h1>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-200',
                pathname.startsWith(item.href) ? 'bg-gray-800 text-white hover:bg-gray-700' : ''
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </Card>
  );
};

export default Sidebar;
