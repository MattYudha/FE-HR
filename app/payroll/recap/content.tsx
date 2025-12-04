'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { DashboardLayout } from '@/components/navigation/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
// AuthGuard will be imported by the parent page dynamically
import { usePayrollRecap } from '@/hooks/usePayroll';
import { DepartmentalRecap } from '@/src/types';
import { DollarSign, Hash, ShieldCheck, Users, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function PayrollRecapPageContent() {
  const { toast } = useToast();
  // Default to the current month in YYYY-MM format
  const [period, setPeriod] = useState(format(new Date(), 'yyyy-MM'));

  const { data: recapData, isLoading, isError } = usePayrollRecap(period);

  const summaryCards = [
    {
      title: 'Total Payroll',
      value: formatCurrency(recapData?.totalPayroll || 0),
      icon: DollarSign,
    },
    {
      title: 'Total Tax (PPH 21)',
      value: formatCurrency(recapData?.totalTax || 0),
      icon: ShieldCheck,
    },
    {
      title: 'Total Net Pay',
      value: formatCurrency(recapData?.totalNet || 0),
      icon: Hash,
    },
    {
      title: 'Employees Paid',
      value: recapData?.totalEmployeesPaid || 0,
      icon: Users,
    },
  ];

  if (isError) {
    toast({
      title: 'Error',
      description: 'Failed to load payroll recap data.',
      variant: 'destructive',
    });
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payroll Recap</h1>
            <p className="text-gray-500">Monthly payroll summary and departmental breakdown</p>
          </div>
          <div className="w-48">
            <Input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {isLoading ? (
          <DataTableSkeleton columns={5} />
        ) : !recapData || recapData.departmentalRecap.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No payroll recap data found"
            description="No payroll data available for the selected period. Ensure payrolls are processed and marked as paid."
          />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {summaryCards.map((card) => (
                <Card key={card.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <card.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Departmental Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-right">Employee Count</TableHead>
                      <TableHead className="text-right">Total Salary</TableHead>
                      <TableHead className="text-right">Total Tax</TableHead>
                      <TableHead className="text-right">Total Net Pay</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recapData.departmentalRecap.map((dept: DepartmentalRecap) => (
                      <TableRow key={dept.department}>
                        <TableCell className="font-medium">{dept.department}</TableCell>
                        <TableCell className="text-right">{dept.employeeCount}</TableCell>
                        <TableCell className="text-right">{formatCurrency(dept.totalSalary)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(dept.totalPph21)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(dept.totalTakeHomePay)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
