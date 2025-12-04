'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Target,
  CheckSquare,
  Calendar,
  LogOut,
  ReceiptText, // For Payroll Recap
} from 'lucide-react';
import useAuthStore from '@/src/stores/authStore';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, requiredRoles: ['admin', 'employee'] },
  { name: 'Employees', href: '/employees', icon: Users, requiredRoles: ['admin'] },
  { 
    name: 'Payroll', 
    href: '/payroll', 
    icon: DollarSign, 
    requiredRoles: ['admin'],
    subItems: [
        { name: 'Records', href: '/payroll', icon: DollarSign, requiredRoles: ['admin'] }, // Explicitly show parent
        { name: 'Recap', href: '/payroll/recap', icon: ReceiptText, requiredRoles: ['admin'] },
    ]
  },
  { name: 'KPI', href: '/kpi', icon: Target, requiredRoles: ['admin'] },
  { name: 'Approval', href: '/approval', icon: CheckSquare, requiredRoles: ['admin'] },
  { name: 'Attendance', href: '/attendance', icon: Calendar, requiredRoles: ['admin', 'employee'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const filteredNavigation = navigation.filter(item => {
    if (!isAuthenticated || !user) return false;
    if (item.requiredRoles.includes(user.role)) {
      // If it has subItems, filter them too
      if (item.subItems) {
        item.subItems = item.subItems.filter(subItem => subItem.requiredRoles.includes(user.role));
      }
      return true;
    }
    return false;
  });

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-gray-900">HR System</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavigation.map((item) => (
            <div key={item.name}>
                <Link
                href={item.href}
                className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    pathname.startsWith(item.href)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
                >
                <item.icon className="h-5 w-5" />
                {item.name}
                </Link>
                {item.subItems && (
                    <div className="ml-4 mt-1 space-y-1">
                        {item.subItems.map(subItem => {
                            const isSubItemActive = pathname === subItem.href;
                            return (
                                <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                        isSubItemActive
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    )}
                                >
                                    <subItem.icon className="h-4 w-4" />
                                    {subItem.name}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        ))}
      </nav>
      <div className="border-t p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
