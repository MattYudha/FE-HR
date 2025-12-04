'use client';

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader } from '@/components/shared/Loader';
import { useDashboardSummary, usePayrollTrend } from '@/hooks/use-dashboard-data';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { PayrollTrendChart } from '@/components/dashboard/PayrollTrendChart';
import { Users, DollarSign, TrendingUp, CalendarCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();

  const { data: summaryData, isLoading: summaryLoading, error: summaryError } = useDashboardSummary();
  const { data: payrollTrendData, isLoading: payrollTrendLoading, error: payrollTrendError } = usePayrollTrend();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || summaryLoading || payrollTrendLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return null; // Or a redirecting message
  }

  if (summaryError || payrollTrendError) {
    return <div className="text-red-500">Error loading dashboard data.</div>;
  }

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-8">
      <h1 className="mb-6 text-3xl font-bold">Welcome, {user?.email}!</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <SummaryCard
          title="Total Employees"
          value={summaryData?.totalEmployees || 0}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Number of active employees"
        />
        <SummaryCard
          title="Total Payroll (Monthly)"
          value={`${summaryData?.totalPayroll.toLocaleString() || 0}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="Total amount paid this month"
        />
        <SummaryCard
          title="Average KPI Score"
          value={summaryData?.averageKpi ? summaryData.averageKpi.toFixed(2) : 'N/A'}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description="Average KPI score across all employees"
        />
        <SummaryCard
          title="Attendance Today"
          value={summaryData?.attendanceToday || 0}
          icon={<CalendarCheck className="h-4 w-4 text-muted-foreground" />}
          description="Employees checked in today"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-1">
        {payrollTrendData && payrollTrendData.length > 0 ? (
          <PayrollTrendChart data={payrollTrendData} />
        ) : (
          <Card>
            <CardHeader><CardTitle>Payroll Trend</CardTitle></CardHeader>
            <CardContent><p>No payroll trend data available.</p></CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}