'use client';

import { useRouter } from 'next/navigation';
import { useApprovalRequest, useApproveRequest, useRejectRequest } from '@/hooks/use-approvals';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/shared/Loader';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';

interface ApprovalDetailPageProps {
  params: { id: string };
}

export default function ApprovalDetailPage({ params }: ApprovalDetailPageProps) {
  const router = useRouter();
  const { id } = params;
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: request, isLoading: isFetching, error: fetchError } = useApprovalRequest(id);
  const { mutateAsync: approveRequest, isPending: isApproving } = useApproveRequest();
  const { mutateAsync: rejectRequest, isPending: isRejecting } = useRejectRequest();

  const isHRorAdmin = user?.role === 'HR_ADMIN' || user?.role === 'SUPER_ADMIN';

  const handleApprove = async () => {
    if (!request) return;
    try {
      await approveRequest({ approvalId: request.id, notes: 'Approved by HR/Admin' });
      toast({
        title: 'Success',
        description: 'Approval request approved.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to approve request.',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async () => {
    if (!request) return;
    try {
      await rejectRequest({ approvalId: request.id, notes: 'Rejected by HR/Admin' });
      toast({
        title: 'Success',
        description: 'Approval request rejected.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to reject request.',
        variant: 'destructive',
      });
    }
  };

  if (isFetching) {
    return <Loader />;
  }

  if (fetchError) {
    return <div className="text-red-500">Error loading approval request: {fetchError.message}</div>;
  }

  if (!request) {
    return <div className="text-red-500">Approval request not found.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Approval Request Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>{request.title}</CardTitle>
          <CardDescription>Type: {request.type} | Status: {request.status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">Requested By:</p>
            <p className="text-lg">{request.employee?.fullName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Description:</p>
            <p className="text-lg">{request.description}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Notes:</p>
            <p className="text-lg">{request.notes || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Created At:</p>
            <p className="text-lg">{format(new Date(request.createdAt), 'PPP HH:mm')}</p>
          </div>
          {request.status !== 'PENDING' && (
            <div>
              <p className="text-sm font-medium">Last Updated:</p>
              <p className="text-lg">{format(new Date(request.updatedAt), 'PPP HH:mm')}</p>
            </div>
          )}

          {isHRorAdmin && request.status === 'PENDING' && (
            <div className="flex space-x-2 mt-6">
              <Button onClick={handleApprove} disabled={isApproving}>
                {isApproving ? 'Approving...' : 'Approve'}
              </Button>
              <Button onClick={handleReject} disabled={isRejecting} variant="destructive">
                {isRejecting ? 'Rejecting...' : 'Reject'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
