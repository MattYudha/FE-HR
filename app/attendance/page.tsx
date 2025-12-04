'use client';

import { AttendanceRecordTable } from '@/components/attendance/AttendanceRecordTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCheckIn, useCheckOut, useMyAttendance } from '@/hooks/use-attendance';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Loader } from '@/components/shared/Loader';

export default function AttendancePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: myAttendance, isLoading: myAttendanceLoading } = useMyAttendance();
  const { mutateAsync: checkIn, isPending: isCheckingIn } = useCheckIn();
  const { mutateAsync: checkOut, isPending: isCheckingOut } = useCheckOut();

  const todayAttendance = myAttendance?.find(record => {
    const recordDate = new Date(record.checkInTime).toDateString();
    const todayDate = new Date().toDateString();
    return recordDate === todayDate;
  });

  const handleCheckIn = async () => {
    try {
      await checkIn();
      toast({
        title: 'Success',
        description: 'Checked in successfully!',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to check in.',
        variant: 'destructive',
      });
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
      toast({
        title: 'Success',
        description: 'Checked out successfully!',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to check out.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || myAttendanceLoading) {
    return <Loader />;
  }

  const isHRorAdmin = user?.role === 'HR_ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance Tracking</h1>

      {!isHRorAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Attendance</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            {!todayAttendance?.checkInTime ? (
              <Button onClick={handleCheckIn} disabled={isCheckingIn}>
                {isCheckingIn ? 'Checking In...' : 'Check In'}
              </Button>
            ) : (
              <p>Checked in at: {new Date(todayAttendance.checkInTime).toLocaleTimeString()}</p>
            )}
            {todayAttendance?.checkInTime && !todayAttendance?.checkOutTime && (
              <Button onClick={handleCheckOut} disabled={isCheckingOut} variant="outline">
                {isCheckingOut ? 'Checking Out...' : 'Check Out'}
              </Button>
            )}
            {todayAttendance?.checkOutTime && (
              <p>Checked out at: {new Date(todayAttendance.checkOutTime).toLocaleTimeString()}</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{isHRorAdmin ? 'All Attendance Records' : 'My Attendance Records'}</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceRecordTable employeeId={isHRorAdmin ? undefined : user?.id} />
        </CardContent>
      </Card>
    </div>
  );
}
