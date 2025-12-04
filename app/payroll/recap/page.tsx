'use client';

import { useState } from 'react';
import { usePayrollRecap } from '@/hooks/use-payroll';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/shared/Loader';
import { format } from 'date-fns';
import { DollarSign, Users, Building2 } from 'lucide-react';

export default function PayrollRecapPage() {
  const [period, setPeriod] = useState(format(new Date(), 'yyyy-MM'));
  const { data: recap, isLoading, error } = usePayrollRecap(period);

  if (isLoading) return <Loader />;
  if (error)
    return <div className="p-8 text-red-500">Failed to load recap data.</div>;

  const formatCurrency = (val: number) =>
    val.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payroll Recap</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Period:</span>
          <Input
            type="text"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-[120px]"
            placeholder="YYYY-MM"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Net Paid
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(recap?.totalNet || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total transfer to employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Taxes (PPh21)
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(recap?.totalTax || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              To be paid to tax office
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Employees Paid
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recap?.totalEmployeesPaid || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Processed in this period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Department Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-medium">Department</th>
                  <th className="p-4 font-medium">Employees</th>
                  <th className="p-4 font-medium">Total Salary</th>
                  <th className="p-4 font-medium">Total Tax</th>
                  <th className="p-4 font-medium text-right">Take Home Pay</th>
                </tr>
              </thead>
              <tbody>
                {recap?.departmentalRecap.map((dept) => (
                  <tr
                    key={dept.department}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">{dept.department}</td>
                    <td className="p-4">{dept.employeeCount}</td>
                    <td className="p-4">{formatCurrency(dept.totalSalary)}</td>
                    <td className="p-4 text-red-600">
                      {formatCurrency(dept.totalPph21)}
                    </td>
                    <td className="p-4 text-right font-bold text-green-700">
                      {formatCurrency(dept.totalTakeHomePay)}
                    </td>
                  </tr>
                ))}
                {(!recap?.departmentalRecap ||
                  recap.departmentalRecap.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-muted-foreground"
                    >
                      No data available for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
