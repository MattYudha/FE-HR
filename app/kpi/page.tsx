'use client';

import { KpiTable } from '@/components/kpi/KpiTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Loader } from '@/components/shared/Loader';

export default function KpiPage() {
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return <Loader />;
  }

  const isHRorAdmin = user?.role === 'HR_ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">KPI Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>{isHRorAdmin ? 'All KPI Records' : 'My KPI Records'}</CardTitle>
        </CardHeader>
        <CardContent>
          <KpiTable employeeId={isHRorAdmin ? undefined : user?.id} />
        </CardContent>
      </Card>
    </div>
  );
}
