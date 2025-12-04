'use client';

import { useRouter } from 'next/navigation';
import { KpiForm } from '@/components/kpi/KpiForm';
import { useCreateKpi } from '@/hooks/use-kpi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateKpiPage() {
  const router = useRouter();
  const { mutateAsync: createKpi, isPending: isLoading } = useCreateKpi();

  const handleSubmit = async (data: any) => {
    await createKpi(data);
    router.push('/kpi');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New KPI</h1>
      <Card>
        <CardHeader>
          <CardTitle>KPI Details</CardTitle>
        </CardHeader>
        <CardContent>
          <KpiForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
