'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader } from '@/components/shared/Loader';
import {
  useDashboardSummary,
  usePayrollTrend,
} from '@/hooks/use-dashboard-data';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { PayrollTrendChart } from '@/components/dashboard/PayrollTrendChart';
import { Users, DollarSign, TrendingUp, CalendarCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();

  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useDashboardSummary();
  const {
    data: payrollTrendData,
    isLoading: payrollTrendLoading,
    error: payrollTrendError,
  } = usePayrollTrend();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || summaryLoading || payrollTrendLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (summaryError || payrollTrendError) {
    return <div className="text-red-500">Error loading dashboard data.</div>;
  }

  const formatCurrency = (value: number | undefined) => {
    return (value ?? 0).toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  };

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Welcome, {user?.name || user?.email}!
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <SummaryCard
          title="Total Employees"
          value={summaryData?.totalEmployees || 0}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Number of active employees"
        />
        <SummaryCard
          title="Total Payroll (Monthly)"
          value={formatCurrency(summaryData?.payrollPaid)}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="Total amount paid this month"
        />
        <SummaryCard
          title="Average KPI Score"
          value={
            summaryData?.kpiAverageScore
              ? Number(summaryData.kpiAverageScore).toFixed(2)
              : 'N/A'
          }
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description="Average KPI score across all employees"
        />

        {/* PERBAIKAN DI SINI: Render string dari object attendanceToday */}
        <SummaryCard
          title="Attendance Today"
          value={
            summaryData?.attendanceToday
              ? `${summaryData.attendanceToday.present} / ${summaryData.attendanceToday.total}`
              : '0 / 0'
          }
          icon={<CalendarCheck className="h-4 w-4 text-muted-foreground" />}
          description="Employees checked in / Total"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-1">
        {payrollTrendData && payrollTrendData.length > 0 ? (
          <PayrollTrendChart
            data={payrollTrendData.map((item) => ({
              period: item.month,
              totalPayroll: item.totalPaid,
            }))}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Payroll Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No payroll trend data available.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
