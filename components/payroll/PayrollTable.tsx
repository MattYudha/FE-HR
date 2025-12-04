'use client';

import { useState } from 'react';
import { usePayrolls, useMarkPayrollAsPaid, useRevertPayrollToPending, Payroll } from '@/hooks/use-payroll';
import { Loader } from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, FileDown } from 'lucide-react';
import { format } from 'date-fns';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function PayrollTable() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [periodFilter, setPeriodFilter] = useState<string | undefined>(undefined);
  const { data: payrolls, isLoading, error } = usePayrolls({ status: statusFilter, period: periodFilter });
  const { mutateAsync: markAsPaid } = useMarkPayrollAsPaid();
  const { mutateAsync: revertToPending } = useRevertPayrollToPending();
  const { toast } = useToast();

  const handleMarkAsPaid = async (id: string) => {
    try {
      await markAsPaid(id);
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

  const handleRevertToPending = async (id: string) => {
    try {
      await revertToPending(id);
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

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">Error loading payrolls: {error.message}</div>;
  }

  return (
    <div className="rounded-md border">
      <div className="flex flex-col md:flex-row items-center justify-between p-4 space-y-2 md:space-y-0">
        <h2 className="text-xl font-semibold">Payrolls</h2>
        <div className="flex items-center space-x-2">
          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
            </SelectContent>
          </Select>
          <Input 
            type="text" 
            placeholder="Filter by Period (YYYY-MM)" 
            value={periodFilter || ''}
            onChange={(e) => setPeriodFilter(e.target.value || undefined)}
            className="w-[200px]"
          />
          <Link href="/payroll/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Payroll
            </Button>
          </Link>
        </div>
      </div>
      <table className="w-full text-left">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Employee Name</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Period</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Net Salary</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Status</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {payrolls && payrolls.length > 0 ? (
            payrolls.map((payroll) => (
              <tr key={payroll.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle font-medium">{payroll.employee?.fullName || 'N/A'}</td>
                <td className="p-4 align-middle">{payroll.period}</td>
                <td className="p-4 align-middle">{payroll.netSalary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                <td className="p-4 align-middle">
                  <span className={`px-2 py-1 rounded-full text-xs ${payroll.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {payroll.status}
                  </span>
                </td>
                <td className="p-4 align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/payroll/${payroll.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      {payroll.status === 'PENDING' && (
                        <DropdownMenuItem onClick={() => handleMarkAsPaid(payroll.id)}>
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      {payroll.status === 'PAID' && (
                        <DropdownMenuItem onClick={() => handleRevertToPending(payroll.id)}>
                          Revert to Pending
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/payroll/${payroll.id}/pdf`} target="_blank" rel="noopener noreferrer">
                          Download PDF Slip <FileDown className="ml-2 h-4 w-4" />
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-center text-muted-foreground">
                No payrolls found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
