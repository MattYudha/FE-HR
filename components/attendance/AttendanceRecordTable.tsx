'use client';

import { useState } from 'react';
import {
  useMyAttendance,
  useAllAttendance,
  AttendanceRecord,
} from '@/hooks/use-attendance';
import { Loader } from '@/components/shared/Loader';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface AttendanceRecordTableProps {
  employeeId?: string; // If provided, fetches attendance for a specific employee (HR/Admin view)
}

export function AttendanceRecordTable({
  employeeId,
}: AttendanceRecordTableProps) {
  const { user } = useAuth();
  const isHRorAdmin = user?.role === 'HR_ADMIN' || user?.role === 'SUPER_ADMIN';

  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  const formattedFromDate = fromDate
    ? format(fromDate, 'yyyy-MM-dd')
    : undefined;
  const formattedToDate = toDate ? format(toDate, 'yyyy-MM-dd') : undefined;

  const {
    data: myAttendance,
    isLoading: myAttendanceLoading,
    error: myAttendanceError,
  } = useMyAttendance(
    !isHRorAdmin || !employeeId
      ? { from: formattedFromDate, to: formattedToDate }
      : undefined,
  );

  const {
    data: allAttendance,
    isLoading: allAttendanceLoading,
    error: allAttendanceError,
  } = useAllAttendance(
    isHRorAdmin
      ? { from: formattedFromDate, to: formattedToDate, employeeId }
      : undefined,
  );

  const records = (isHRorAdmin ? allAttendance : myAttendance) ?? [];
  const isLoading = isHRorAdmin ? allAttendanceLoading : myAttendanceLoading;
  const error = isHRorAdmin ? allAttendanceError : myAttendanceError;

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading attendance records: {error.message}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      {/* Filter bar */}
      {/* ... (bagian JSX lainnya yang sudah kamu punya tetap sama) */}
      {/* saya tidak ubah struktur tabelmu */}
      {/* gunakan kembali JSX yang kamu kirim tadi untuk tabel */}
    </div>
  );
}
