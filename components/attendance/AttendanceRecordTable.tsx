'use client';

import { useState } from 'react';
import { useMyAttendance, useAllAttendance, AttendanceRecord } from '@/hooks/use-attendance';
import { Loader } from '@/components/shared/Loader';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface AttendanceRecordTableProps {
  employeeId?: string; // If provided, fetches attendance for a specific employee (HR/Admin view)
}

export function AttendanceRecordTable({ employeeId }: AttendanceRecordTableProps) {
  const { user } = useAuth();
  const isHRorAdmin = user?.role === 'HR_ADMIN' || user?.role === 'SUPER_ADMIN';

  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  const formattedFromDate = fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined;
  const formattedToDate = toDate ? format(toDate, 'yyyy-MM-dd') : undefined;

  const { data: myAttendance, isLoading: myAttendanceLoading, error: myAttendanceError } = useMyAttendance(
    !isHRorAdmin || !employeeId ? { from: formattedFromDate, to: formattedToDate } : undefined
  );
  const { data: allAttendance, isLoading: allAttendanceLoading, error: allAttendanceError } = useAllAttendance(
    isHRorAdmin ? { from: formattedFromDate, to: formattedToDate, employeeId } : undefined
  );

  const records = isHRorAdmin ? allAttendance : myAttendance;
  const isLoading = isHRorAdmin ? allAttendanceLoading : myAttendanceLoading;
  const error = isHRorAdmin ? allAttendanceError : myAttendanceError;

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">Error loading attendance records: {error.message}</div>;
  }

  return (
    <div className="rounded-md border">
      <div className="flex flex-col md:flex-row items-center justify-between p-4 space-y-2 md:space-y-0">
        <h2 className="text-xl font-semibold">Attendance Records</h2>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !fromDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? format(fromDate, "PPP") : <span>Pick a start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={setFromDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !toDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? format(toDate, "PPP") : <span>Pick an end date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={setToDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <table className="w-full text-left">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {isHRorAdmin && <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Employee Name</th>}
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Check-in Time</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Check-out Time</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {records && records.length > 0 ? (
            records.map((record) => (
              <tr key={record.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {isHRorAdmin && <td className="p-4 align-middle font-medium">{record.employee?.fullName || 'N/A'}</td>}
                <td className="p-4 align-middle">{format(new Date(record.checkInTime), 'PPP HH:mm')}</td>
                <td className="p-4 align-middle">{record.checkOutTime ? format(new Date(record.checkOutTime), 'PPP HH:mm') : 'N/A'}</td>
                <td className="p-4 align-middle">
                  <span className={`px-2 py-1 rounded-full text-xs ${record.status === 'PRESENT' ? 'bg-green-100 text-green-800' : record.status === 'ABSENT' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isHRorAdmin ? 4 : 3} className="p-4 text-center text-muted-foreground">
                No attendance records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
