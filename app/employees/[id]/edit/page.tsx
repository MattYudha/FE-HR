'use client';

import { useRouter } from 'next/navigation';
import { useEmployee } from '@/hooks/use-employees';
import { usePayrolls } from '@/hooks/use-payroll';
import { useAllAttendance } from '@/hooks/use-attendance';
import { useAllKpis } from '@/hooks/use-kpi';
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
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  MapPin,
  Phone,
  Mail,
  Building2,
  Calendar,
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

  // 1. Fetch semua data yang relevan dengan karyawan ini
  const { data: employee, isLoading: empLoading } = useEmployee(id);

  // Fetch Payroll History khusus karyawan ini
  const { data: payrolls, isLoading: payLoading } = usePayrolls({
    employeeId: id,
  });

  // Fetch Attendance History khusus karyawan ini
  const { data: attendance, isLoading: attLoading } = useAllAttendance({
    employeeId: id,
  });

  // Fetch KPI History khusus karyawan ini
  const { data: kpis, isLoading: kpiLoading } = useAllKpis({ employeeId: id });

  if (empLoading) return <Loader />;
  if (!employee)
    return <div className="p-8 text-center">Employee not found</div>;

  // Helper untuk inisial nama
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  // Helper format currency
  const formatMoney = (amount: number) =>
    amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

  return (
    <div className="space-y-6 pb-10">
      {/* --- HEADER SECTION --- */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex-1" />
        <Button onClick={() => router.push(`/employees/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" /> Edit Employee
        </Button>
      </div>

      {/* --- PROFILE CARD --- */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <div className="px-8 pb-8">
          <div className="relative flex items-end -mt-12 mb-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.fullName}`}
              />
              <AvatarFallback className="text-xl">
                {getInitials(employee.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 mb-1">
              <h1 className="text-2xl font-bold">{employee.fullName}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{employee.position}</span>
                <span>•</span>
                <span>{employee.department}</span>
              </div>
            </div>
            <div className="flex-1" />
            <Badge className="mb-2 text-base px-4 py-1 bg-green-500 hover:bg-green-600">
              Active Employee
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{employee.userId}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{employee.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{employee.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-green-700">
                {formatMoney(employee.baseSalary)} / month
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* --- TABS SECTION --- */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="payroll"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            Payroll History
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            Attendance
          </TabsTrigger>
          <TabsTrigger
            value="kpi"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            Performance (KPI)
          </TabsTrigger>
        </TabsList>

        {/* 1. OVERVIEW TAB */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Employee ID</span>
                  <span className="font-mono">
                    {employee.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Joined Date</span>
                  <span>
                    {employee.createdAt
                      ? format(new Date(employee.createdAt), 'dd MMMM yyyy')
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Department</span>
                  <span>{employee.department}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">
                    Employment Status
                  </span>
                  <span>Permanent</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Compensation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Base Salary</span>
                  <span className="font-semibold">
                    {formatMoney(employee.baseSalary)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Bank Account</span>
                  <span>BCA - 1234567890</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Tax Status</span>
                  <span>TK/0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. PAYROLL HISTORY TAB */}
        <TabsContent value="payroll" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                List of all salary payments processed for this employee.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payLoading ? (
                <Loader />
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="p-4 font-medium">Period</th>
                        <th className="p-4 font-medium">Base Salary</th>
                        <th className="p-4 font-medium">Allowances</th>
                        <th className="p-4 font-medium">Deductions</th>
                        <th className="p-4 font-medium">Net Pay</th>
                        <th className="p-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrolls?.map((pay) => (
                        <tr key={pay.id} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{pay.period}</td>
                          <td className="p-4">{formatMoney(pay.baseSalary)}</td>
                          <td className="p-4 text-green-600">
                            +{formatMoney(pay.allowances)}
                          </td>
                          <td className="p-4 text-red-600">
                            -{formatMoney(pay.deductions)}
                          </td>
                          <td className="p-4 font-bold">
                            {formatMoney(pay.netSalary)}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={
                                pay.status === 'PAID' ? 'default' : 'secondary'
                              }
                            >
                              {pay.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                      {!payrolls?.length && (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-4 text-center text-muted-foreground"
                          >
                            No payroll history found.
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

        {/* 3. ATTENDANCE TAB */}
        <TabsContent value="attendance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Record</CardTitle>
            </CardHeader>
            <CardContent>
              {attLoading ? (
                <Loader />
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Check In</th>
                        <th className="p-4 font-medium">Check Out</th>
                        <th className="p-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance?.map((att) => (
                        <tr key={att.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            {format(
                              new Date(att.checkInTime),
                              'EEE, dd MMM yyyy',
                            )}
                          </td>
                          <td className="p-4 text-green-700 flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {format(new Date(att.checkInTime), 'HH:mm')}
                          </td>
                          <td className="p-4 text-orange-700">
                            {att.checkOutTime
                              ? format(new Date(att.checkOutTime), 'HH:mm')
                              : '-'}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              {att.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                      {!attendance?.length && (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-4 text-center text-muted-foreground"
                          >
                            No attendance records found.
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

        {/* 4. KPI TAB */}
        <TabsContent value="kpi" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {kpiLoading ? (
              <Loader />
            ) : (
              kpis?.map((kpi) => (
                <Card key={kpi.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">
                          {kpi.category}
                        </CardTitle>
                        <CardDescription>Period: {kpi.period}</CardDescription>
                      </div>
                      <div
                        className={`text-2xl font-bold ${kpi.score >= 80 ? 'text-green-600' : 'text-orange-600'}`}
                      >
                        {kpi.score}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md italic">
                      "{kpi.notes}"
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
            {!kpis?.length && !kpiLoading && (
              <div className="col-span-2 text-center text-muted-foreground p-8 border rounded-md border-dashed">
                No KPI records found for this employee.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
