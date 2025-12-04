'use client';

import { useState } from 'react';
import { useMyApprovalRequests, useAllApprovalRequests, ApprovalRequest } from '@/hooks/use-approvals';
import { Loader } from '@/components/shared/Loader';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ApprovalRequestTableProps {
  employeeId?: string; // If provided, fetches requests for a specific employee (HR/Admin view)
}

export function ApprovalRequestTable({ employeeId }: ApprovalRequestTableProps) {
  const { user } = useAuth();
  const isHRorAdmin = user?.role === 'HR_ADMIN' || user?.role === 'SUPER_ADMIN';

  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data: myRequests, isLoading: myRequestsLoading, error: myRequestsError } = useMyApprovalRequests();
  const { data: allRequests, isLoading: allRequestsLoading, error: allRequestsError } = useAllApprovalRequests(
    isHRorAdmin ? { status: statusFilter, employeeId } : undefined
  );

  const records = isHRorAdmin ? allRequests : myRequests;
  const isLoading = isHRorAdmin ? allRequestsLoading : myRequestsLoading;
  const error = isHRorAdmin ? allRequestsError : myRequestsError;

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">Error loading approval requests: {error.message}</div>;
  }

  return (
    <div className="rounded-md border">
      <div className="flex flex-col md:flex-row items-center justify-between p-4 space-y-2 md:space-y-0">
        <h2 className="text-xl font-semibold">Approval Requests</h2>
        <div className="flex items-center space-x-2">
          {isHRorAdmin && (
            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          )}
          {!isHRorAdmin && (
            <Link href="/approvals/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Request
              </Button>
            </Link>
          )}
        </div>
      </div>
      <table className="w-full text-left">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {isHRorAdmin && <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Employee Name</th>}
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Type</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Title</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Status</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Created At</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {records && records.length > 0 ? (
            records.map((request) => (
              <tr key={request.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {isHRorAdmin && <td className="p-4 align-middle font-medium">{request.employee?.fullName || 'N/A'}</td>}
                <td className="p-4 align-middle">{request.type}</td>
                <td className="p-4 align-middle">{request.title}</td>
                <td className="p-4 align-middle">
                  <span className={`px-2 py-1 rounded-full text-xs ${request.status === 'APPROVED' ? 'bg-green-100 text-green-800' : request.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {request.status}
                  </span>
                </td>
                <td className="p-4 align-middle">{format(new Date(request.createdAt), 'PPP')}</td>
                <td className="p-4 align-middle">
                  <Link href={`/approvals/${request.id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isHRorAdmin ? 6 : 5} className="p-4 text-center text-muted-foreground">
                No approval requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
