'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/navigation/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useToast } from '@/hooks/use-toast';
import { Approval } from '@/src/types';
import { useApprovals, useApproveRequest, useRejectRequest } from '@/hooks/useApprovals';
import { Check, X, Clock, Loader2 } from 'lucide-react';

export default function ApprovalPageContent() {
  const { toast } = useToast();
  const [filteredApprovals, setFilteredApprovals] = useState<Approval[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    approval: Approval | null;
    action: 'approve' | 'reject' | null;
  }>({
    open: false,
    approval: null,
    action: null,
  });
  const [reviewerNotes, setReviewerNotes] = useState('');

  const { data: approvals = [], isLoading } = useApprovals();
  const approveMutation = useApproveRequest();
  const rejectMutation = useRejectRequest();

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredApprovals(approvals);
    } else {
      setFilteredApprovals(approvals.filter((a) => a.status === activeTab));
    }
  }, [activeTab, approvals]);

  const handleAction = () => {
    if (!actionDialog.approval || !actionDialog.action) return;

    const mutationFn = actionDialog.action === 'approve' ? approveMutation.mutate : rejectMutation.mutate;
    const actionText = actionDialog.action === 'approve' ? 'approved' : 'rejected';

    mutationFn(
      { id: actionDialog.approval.id, reviewerNotes },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: `Request ${actionText} successfully`,
          });
          setActionDialog({ open: false, approval: null, action: null });
          setReviewerNotes('');
        },
      }
    );
  };

  const openActionDialog = (approval: Approval, action: 'approve' | 'reject') => {
    setActionDialog({ open: true, approval, action });
    setReviewerNotes('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <DataTableSkeleton columns={7} />
      </DashboardLayout>
    );
  }

  const isMutating = approveMutation.isPending || rejectMutation.isPending;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approval Requests</h1>
          <p className="text-gray-500">Review and manage approval requests</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="rounded-lg border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <EmptyState
                          icon={Check}
                          title="No approval requests found"
                          description="No approval requests match the current filter."
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApprovals.map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell className="font-medium">{approval.employeeName}</TableCell>
                        <TableCell className="capitalize">{approval.type}</TableCell>
                        <TableCell className="max-w-xs truncate">{approval.reason}</TableCell>
                        <TableCell>
                          {new Date(approval.startDate).toLocaleDateString()} -{' '}
                          {new Date(approval.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(approval.status)}</TableCell>
                        <TableCell>{new Date(approval.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          {approval.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openActionDialog(approval, 'approve')}
                                className="text-green-600 hover:bg-green-50"
                                disabled={isMutating}
                              >
                                {approveMutation.isPending && actionDialog.approval?.id === approval.id && actionDialog.action === 'approve' ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openActionDialog(approval, 'reject')}
                                className="text-red-600 hover:bg-red-50"
                                disabled={isMutating}
                              >
                                {rejectMutation.isPending && actionDialog.approval?.id === approval.id && actionDialog.action === 'reject' ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          )}
                          {approval.status !== 'pending' && (
                            <span className="text-sm text-gray-500">
                              {approval.reviewedAt
                                ? new Date(approval.reviewedAt).toLocaleDateString()
                                : '-'}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) => setActionDialog({ open, approval: null, action: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === 'approve' ? 'Approve' : 'Reject'} Request
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === 'approve'
                ? 'Approve this request from'
                : 'Reject this request from'}{' '}
              {actionDialog.approval?.employeeName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Request Details</Label>
              <div className="rounded-lg bg-gray-50 p-3 space-y-1 text-sm">
                <p>
                  <span className="font-medium">Type:</span>{' '}
                  <span className="capitalize">{actionDialog.approval?.type}</span>
                </p>
                <p>
                  <span className="font-medium">Reason:</span> {actionDialog.approval?.reason}
                </p>
                <p>
                  <span className="font-medium">Period:</span>{' '}
                  {actionDialog.approval?.startDate &&
                    new Date(actionDialog.approval.startDate).toLocaleDateString()}{' '}
                  -{' '}
                  {actionDialog.approval?.endDate &&
                    new Date(actionDialog.approval.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Reviewer Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes or comments..."
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                rows={4}
                disabled={isMutating}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ open: false, approval: null, action: null })}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              variant={actionDialog.action === 'approve' ? 'default' : 'destructive'}
              disabled={isMutating}
            >
              {isMutating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `${actionDialog.action === 'approve' ? 'Approve' : 'Reject'}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
