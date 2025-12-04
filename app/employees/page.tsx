'use client';

import { useRouter } from 'next/navigation';
import { useEmployee } from '@/hooks/use-employees'; // Pastikan file ini ada (dari chat sebelumnya)
import { usePayrolls } from '@/hooks/use-payroll';
import { useEmployeeAttendance } from '@/hooks/useAttendance'; // Hook baru
import { useKpis } from '@/hooks/useKpis'; // Hook yang sudah diupdate
import { Loader } from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';

interface PageProps {
  params: { id: string };
}

export default function EmployeeDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = params;

  // Fetch Data
  const { data: employee, isLoading: empLoading } = useEmployee(id);
  const { data: payrolls, isLoading: payLoading } = usePayrolls({
    employeeId: id,
  });
  const { data: attendance, isLoading: attLoading } = useEmployeeAttendance(id); // Panggil hook baru
  const { data: kpis, isLoading: kpiLoading } = useKpis({ employeeId: id }); // Panggil dengan filter

  if (empLoading) return <Loader />;
  if (!employee)
    return <div className="p-8 text-center">Employee not found</div>;

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  const formatMoney = (amount: number) =>
    amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push('/employees')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to List
        </Button>
        <div className="flex-1" />
        <Button onClick={() => router.push(`/employees/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" /> Edit
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-slate-800" />
        <div className="px-8 pb-8">
          <div className="relative flex items-end -mt-12 mb-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-sm bg-white">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.fullName}`}
              />
              <AvatarFallback>{getInitials(employee.fullName)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 mb-1">
              <h1 className="text-2xl font-bold">{employee.fullName}</h1>
              <div className="text-muted-foreground">
                {employee.position} • {employee.department}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />{' '}
              {employee.userId}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />{' '}
              {employee.phone}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />{' '}
              {employee.address}
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
              <DollarSign className="h-4 w-4" />{' '}
              {formatMoney(employee.baseSalary)}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="payroll" className="w-full">
        <TabsList>
          <TabsTrigger value="payroll">Payroll History</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="kpi">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="payroll" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
            </CardHeader>
            <CardContent>
              {payLoading ? (
                <Loader />
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm text-left p-4">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="p-3">Period</th>
                        <th className="p-3">Net Pay</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrolls?.map((p) => (
                        <tr key={p.id} className="border-b">
                          <td className="p-3">{p.period}</td>
                          <td className="p-3 font-bold">
                            {formatMoney(p.netSalary)}
                          </td>
                          <td className="p-3">
                            <Badge>{p.status}</Badge>
                          </td>
                        </tr>
                      ))}
                      {!payrolls?.length && (
                        <tr>
                          <td colSpan={3} className="p-4 text-center">
                            No data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              {attLoading ? (
                <Loader />
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm text-left p-4">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Check In</th>
                        <th className="p-3">Check Out</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance?.map((a) => (
                        <tr key={a.id} className="border-b">
                          <td className="p-3">
                            {format(new Date(a.checkInTime), 'dd MMM yyyy')}
                          </td>
                          <td className="p-3 text-green-600">
                            {format(new Date(a.checkInTime), 'HH:mm')}
                          </td>
                          <td className="p-3 text-red-600">
                            {a.checkOutTime
                              ? format(new Date(a.checkOutTime), 'HH:mm')
                              : '-'}
                          </td>
                        </tr>
                      ))}
                      {!attendance?.length && (
                        <tr>
                          <td colSpan={3} className="p-4 text-center">
                            No data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kpi" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>KPI Records</CardTitle>
            </CardHeader>
            <CardContent>
              {kpiLoading ? (
                <Loader />
              ) : (
                <div className="space-y-4">
                  {kpis?.map((k) => (
                    <div
                      key={k.id}
                      className="flex justify-between items-center border p-4 rounded-lg"
                    >
                      <div>
                        <p className="font-bold">{k.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {k.period}
                        </p>
                      </div>
                      <div className="text-xl font-bold text-blue-600">
                        {k.score}
                      </div>
                    </div>
                  ))}
                  {!kpis?.length && (
                    <div className="text-center p-4">No KPI records</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
