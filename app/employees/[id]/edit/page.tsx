'use client';

import { useRouter } from 'next/navigation';
import { EmployeeForm } from '@/components/employee/EmployeeForm';
import { useEmployee, useUpdateEmployee } from '@/hooks/use-employees';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/shared/Loader';

interface EditEmployeePageProps {
  params: { id: string };
}

export default function EditEmployeePage({ params }: EditEmployeePageProps) {
  const router = useRouter();
  const { id } = params;

  const { data: employee, isLoading: isFetching, error: fetchError } = useEmployee(id);
  const { mutateAsync: updateEmployee, isPending: isUpdating } = useUpdateEmployee();

  const handleSubmit = async (data: any) => {
    await updateEmployee({ id, data });
    router.push('/employees');
  };

  if (isFetching) {
    return <Loader />;
  }

  if (fetchError) {
    return <div className="text-red-500">Error loading employee data: {fetchError.message}</div>;
  }

  if (!employee) {
    return <div className="text-red-500">Employee not found.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Employee</h1>
      <Card>
        <CardHeader>
          <CardTitle>Employee Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeForm initialData={employee} onSubmit={handleSubmit} isLoading={isUpdating} />
        </CardContent>
      </Card>
    </div>
  );
}
