'use client';

import { useRouter } from 'next/navigation';
import { ApprovalRequestForm } from '@/components/approval/ApprovalRequestForm';
import { useCreateApprovalRequest } from '@/hooks/use-approvals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateApprovalRequestPage() {
  const router = useRouter();
  const { mutateAsync: createRequest, isPending: isLoading } = useCreateApprovalRequest();

  const handleSubmit = async (data: any) => {
    await createRequest(data);
    router.push('/approvals');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Approval Request</h1>
      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ApprovalRequestForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
