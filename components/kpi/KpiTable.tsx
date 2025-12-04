'use client';

import { useState } from 'react';
import { useMyKpis, useAllKpis, Kpi } from '@/hooks/use-kpi';
import { Loader } from '@/components/shared/Loader';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

interface KpiTableProps {
  employeeId?: string; // If provided, fetches KPIs for a specific employee (HR/Admin view)
}

export function KpiTable({ employeeId }: KpiTableProps) {
  const { user } = useAuth();
  const isHRorAdmin = user?.role === 'HR_ADMIN' || user?.role === 'SUPER_ADMIN';

  const [periodFilter, setPeriodFilter] = useState<string | undefined>(undefined);

  const { data: myKpis, isLoading: myKpisLoading, error: myKpisError } = useMyKpis();
  const { data: allKpis, isLoading: allKpisLoading, error: allKpisError } = useAllKpis(
    isHRorAdmin ? { period: periodFilter, employeeId } : undefined
  );

  const records = isHRorAdmin ? allKpis : myKpis;
  const isLoading = isHRorAdmin ? allKpisLoading : myKpisLoading;
  const error = isHRorAdmin ? allKpisError : myKpisError;

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">Error loading KPI records: {error.message}</div>;
  }

  return (
    <div className="rounded-md border">
      <div className="flex flex-col md:flex-row items-center justify-between p-4 space-y-2 md:space-y-0">
        <h2 className="text-xl font-semibold">KPI Records</h2>
        <div className="flex items-center space-x-2">
          {isHRorAdmin && (
            <Input 
              type="text" 
              placeholder="Filter by Period (YYYY-MM)" 
              value={periodFilter || ''}
              onChange={(e) => setPeriodFilter(e.target.value || undefined)}
              className="w-[200px]"
            />
          )}
          {isHRorAdmin && (
            <Link href="/kpi/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create KPI
              </Button>
            </Link>
          )}
        </div>
      </div>
      <table className="w-full text-left">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {isHRorAdmin && <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Employee Name</th>}
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Period</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Category</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Score</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Notes</th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {records && records.length > 0 ? (
            records.map((kpi) => (
              <tr key={kpi.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {isHRorAdmin && <td className="p-4 align-middle font-medium">{kpi.employee?.fullName || 'N/A'}</td>}
                <td className="p-4 align-middle">{kpi.period}</td>
                <td className="p-4 align-middle">{kpi.category}</td>
                <td className="p-4 align-middle">{kpi.score}</td>
                <td className="p-4 align-middle">{kpi.notes}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isHRorAdmin ? 5 : 4} className="p-4 text-center text-muted-foreground">
                No KPI records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
