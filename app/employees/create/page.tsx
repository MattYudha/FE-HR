'use client';

import { useRouter } from 'next/navigation';
import { EmployeeForm } from '@/components/employee/EmployeeForm';
import { useCreateEmployee } from '@/hooks/use-employees';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateEmployeePage() {
  const router = useRouter();
  const { mutateAsync: createEmployee, isPending: isLoading } = useCreateEmployee();

  const handleSubmit = async (data: any) => {
    await createEmployee(data);
    router.push('/employees');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Employee</h1>
      <Card>
        <CardHeader>
          <CardTitle>Employee Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
