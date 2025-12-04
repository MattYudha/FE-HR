'use client';

import { PayrollTable } from '@/components/payroll/PayrollTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PayrollsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payroll Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payroll List</CardTitle>
        </CardHeader>
        <CardContent>
          <PayrollTable />
        </CardContent>
      </Card>
    </div>
  );
}
