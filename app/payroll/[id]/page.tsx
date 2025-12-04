'use client';

import { useRouter } from 'next/navigation';
import { usePayroll, useMarkPayrollAsPaid, useRevertPayrollToPending, downloadPayrollSlip } from '@/hooks/use-payroll';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/shared/Loader';
import { useToast } from '@/components/ui/use-toast';
import { FileDown } from 'lucide-react';

interface PayrollDetailPageProps {
  params: { id: string };
}

export default function PayrollDetailPage({ params }: PayrollDetailPageProps) {
  const router = useRouter();
  const { id } = params;
  const { toast } = useToast();

  const { data: payroll, isLoading: isFetching, error: fetchError } = usePayroll(id);
  const { mutateAsync: markAsPaid, isPending: isMarkingPaid } = useMarkPayrollAsPaid();
  const { mutateAsync: revertToPending, isPending: isReverting } = useRevertPayrollToPending();

  const handleMarkAsPaid = async () => {
    if (!payroll) return;
    try {
      await markAsPaid(payroll.id);
      toast({
        title: 'Success',
        description: 'Payroll marked as paid.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to mark payroll as paid.',
        variant: 'destructive',
      });
    }
  };

  const handleRevertToPending = async () => {
    if (!payroll) return;
    try {
      await revertToPending(payroll.id);
      toast({
        title: 'Success',
        description: 'Payroll reverted to pending.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to revert payroll to pending.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadSlip = async () => {
    if (!payroll) return;
    try {
      await downloadPayrollSlip(payroll.id);
      toast({
        title: 'Success',
        description: 'Payroll slip downloaded successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to download payroll slip.',
        variant: 'destructive',
      });
    }
  };

  if (isFetching) {
    return <Loader />;
  }

  if (fetchError) {
    return <div className="text-red-500">Error loading payroll data: {fetchError.message}</div>;
  }

  if (!payroll) {
    return <div className="text-red-500">Payroll not found.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payroll Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payroll for {payroll.employee?.fullName || 'N/A'}</CardTitle>
          <CardDescription>Period: {payroll.period}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Employee ID:</p>
              <p className="text-lg">{payroll.employeeId}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Position:</p>
              <p className="text-lg">{payroll.employee?.position || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Base Salary:</p>
              <p className="text-lg">{payroll.baseSalary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Allowances:</p>
              <p className="text-lg">{payroll.allowances.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Deductions:</p>
              <p className="text-lg">{payroll.deductions.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Net Salary:</p>
              <p className="text-lg font-bold">{payroll.netSalary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status:</p>
              <p className="text-lg">
                <span className={`px-2 py-1 rounded-full text-sm ${payroll.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {payroll.status}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Created At:</p>
              <p className="text-lg">{new Date(payroll.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex space-x-2 mt-6">
            {payroll.status === 'PENDING' && (
              <Button onClick={handleMarkAsPaid} disabled={isMarkingPaid}>
                {isMarkingPaid ? 'Marking...' : 'Mark as Paid'}
              </Button>
            )}
            {payroll.status === 'PAID' && (
              <Button onClick={handleRevertToPending} disabled={isReverting} variant="outline">
                {isReverting ? 'Reverting...' : 'Revert to Pending'}
              </Button>
            )}
            <Button onClick={handleDownloadSlip} variant="secondary">
              <FileDown className="mr-2 h-4 w-4" /> Download PDF Slip
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
