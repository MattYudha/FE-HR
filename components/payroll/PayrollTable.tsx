'use client';

import { useState } from 'react';
import {
  usePayrolls,
  useMarkPayrollAsPaid,
  useRevertPayrollToPending,
  downloadPayrollSlip,
  exportPayrollReport,
} from '@/hooks/use-payroll';
import { Loader } from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, FileDown, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function PayrollTable() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  // Default period ke bulan ini agar export bekerja dengan benar
  const currentMonth = format(new Date(), 'yyyy-MM');
  const [periodFilter, setPeriodFilter] = useState<string | undefined>(
    currentMonth,
  );

  const {
    data: payrolls,
    isLoading,
    error,
  } = usePayrolls({ status: statusFilter, period: periodFilter });
  const { mutateAsync: markAsPaid } = useMarkPayrollAsPaid();
  const { mutateAsync: revertToPending } = useRevertPayrollToPending();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  // Fungsi Handle Export Excel
  const handleExport = async () => {
    if (!periodFilter) {
      toast({
        title: 'Error',
        description: 'Please select a period to export',
        variant: 'destructive',
      });
      return;
    }
    try {
      setIsExporting(true);
      await exportPayrollReport(periodFilter, 'xlsx');
      toast({
        title: 'Success',
        description: 'Report downloaded successfully',
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to export report',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Fungsi Handle Download PDF Slip
  const handleDownloadPDF = async (id: string, name: string) => {
    try {
      toast({ title: 'Processing', description: 'Generating PDF slip...' });
      await downloadPayrollSlip(id, name);
      toast({ title: 'Success', description: 'Slip downloaded successfully' });
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to download slip',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      await markAsPaid(id);
      toast({ title: 'Success', description: 'Payroll marked as paid.' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to mark as paid.',
        variant: 'destructive',
      });
    }
  };

  const handleRevertToPending = async (id: string) => {
    try {
      await revertToPending(id);
      toast({ title: 'Success', description: 'Payroll reverted to pending.' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to revert.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="rounded-md border bg-white shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between p-4 space-y-2 md:space-y-0 gap-4">
        <h2 className="text-xl font-semibold">Payroll List</h2>

        {/* Filters & Actions Area */}
        <div className="flex flex-wrap items-center gap-2">
          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="YYYY-MM"
            value={periodFilter || ''}
            onChange={(e) => setPeriodFilter(e.target.value || undefined)}
            className="w-[120px]"
          />

          {/* New Export Button */}
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export Excel'}
          </Button>

          <Link href="/payroll/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Payroll
            </Button>
          </Link>
        </div>
      </div>

      <table className="w-full text-left">
        <thead className="[&_tr]:border-b bg-gray-50">
          <tr className="border-b transition-colors">
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">
              Employee
            </th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">
              Period
            </th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">
              Net Salary
            </th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">
              Status
            </th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {payrolls && payrolls.length > 0 ? (
            payrolls.map((payroll) => (
              <tr
                key={payroll.id}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="p-4 font-medium">
                  {payroll.employee?.fullName || 'N/A'}
                </td>
                <td className="p-4">{payroll.period}</td>
                <td className="p-4 font-mono">
                  {payroll.netSalary.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      payroll.status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {payroll.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <DotsHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/payroll/${payroll.id}`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>

                      {/* Fitur Download PDF */}
                      <DropdownMenuItem
                        onClick={() =>
                          handleDownloadPDF(
                            payroll.id,
                            payroll.employee?.fullName || 'employee',
                          )
                        }
                      >
                        <FileDown className="mr-2 h-4 w-4" /> Download Slip
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {payroll.status === 'PENDING' && (
                        <DropdownMenuItem
                          onClick={() => handleMarkAsPaid(payroll.id)}
                          className="text-green-600"
                        >
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      {payroll.status === 'PAID' && (
                        <DropdownMenuItem
                          onClick={() => handleRevertToPending(payroll.id)}
                          className="text-orange-600"
                        >
                          Revert to Pending
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-8 text-center text-muted-foreground">
                No payroll records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
