'use client';

import { EmployeeTable } from '@/components/employee/EmployeeTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Employee Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeTable />
        </CardContent>
      </Card>
    </div>
  );
}
