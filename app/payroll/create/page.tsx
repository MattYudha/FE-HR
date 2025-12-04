'use client';

import { useRouter } from 'next/navigation';
import { PayrollForm } from '@/components/payroll/PayrollForm';
import { useCreatePayroll } from '@/hooks/use-payroll';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreatePayrollPage() {
  const router = useRouter();
  const { mutateAsync: createPayroll, isPending: isLoading } = useCreatePayroll();

  const handleSubmit = async (data: any) => {
    await createPayroll(data);
    router.push('/payroll');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Payroll</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payroll Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PayrollForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
