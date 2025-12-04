'use client';

import { ApprovalRequestTable } from '@/components/approval/ApprovalRequestTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Loader } from '@/components/shared/Loader';

export default function ApprovalsPage() {
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return <Loader />;
  }

  const isHRorAdmin = user?.role === 'HR_ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Approval Workflow</h1>
      <Card>
        <CardHeader>
          <CardTitle>{isHRorAdmin ? 'All Approval Requests' : 'My Approval Requests'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ApprovalRequestTable employeeId={isHRorAdmin ? undefined : user?.id} />
        </CardContent>
      </Card>
    </div>
  );
}
