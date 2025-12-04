'use client';

import { useState, useEffect } from 'react';
import { AttendanceRecordTable } from '@/components/attendance/AttendanceRecordTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useCheckIn,
  useCheckOut,
  useMyAttendance,
} from '@/hooks/use-attendance';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Loader } from '@/components/shared/Loader';

// Interface sederhana untuk membantu autocomplete (opsional, sesuaikan dengan types.ts Anda)
interface AttendanceItem {
  id: string;
  checkInTime: string;
  checkOutTime?: string;
  status?: string;
}

export default function AttendancePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Mengambil data absensi saya
  const { data: myAttendance, isLoading: myAttendanceLoading } =
    useMyAttendance();

  // Mengambil fungsi mutasi untuk check-in/out
  const { mutateAsync: checkIn, isPending: isCheckingIn } = useCheckIn();
  const { mutateAsync: checkOut, isPending: isCheckingOut } = useCheckOut();

  // Mencari data absensi hari ini dari list myAttendance
  // Asumsi: myAttendance adalah array of objects
  const todayAttendance = Array.isArray(myAttendance)
    ? myAttendance.find((record: AttendanceItem) => {
        const recordDate = new Date(record.checkInTime).toDateString();
        const todayDate = new Date().toDateString();
        return recordDate === todayDate;
      })
    : null;

  const handleCheckIn = async () => {
    try {
      // Mengirim object kosong {} jika backend tidak mewajibkan data lokasi/catatan
      // Jika backend butuh lokasi, Anda perlu menambahkan logic navigator.geolocation di sini
      await checkIn({});

      toast({
        title: 'Success',
        description: 'Checked in successfully!',
        variant: 'default', // atau 'success' jika sudah dicustom
      });
    } catch (error: any) {
      console.error('Check-in failed:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to check in.',
        variant: 'destructive',
      });
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut({}); // Mengirim object kosong

      toast({
        title: 'Success',
        description: 'Checked out successfully!',
        variant: 'default',
      });
    } catch (error: any) {
      console.error('Check-out failed:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to check out.',
        variant: 'destructive',
      });
    }
  };

  // Tampilkan loader jika Auth atau Data Absensi sedang loading
  if (authLoading || myAttendanceLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Cek Role User
  const isHRorAdmin = user?.role === 'HR_ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Attendance Tracking
        </h1>
        <p className="text-muted-foreground">
          Manage your daily attendance and view history.
        </p>
      </div>

      {/* Card Check-In/Check-Out (Hanya muncul jika BUKAN HR/Admin, atau jika HR juga butuh absen hapus kondisi !isHRorAdmin) */}
      {!isHRorAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>
              Daily Attendance ({new Date().toLocaleDateString()})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            {/* Logic Tombol Check In */}
            {!todayAttendance?.checkInTime ? (
              <Button
                onClick={handleCheckIn}
                disabled={isCheckingIn}
                className="w-full sm:w-auto"
              >
                {isCheckingIn ? 'Checking In...' : 'Check In'}
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-md border border-green-200">
                <span className="font-semibold">✓ Checked in at:</span>
                <span>
                  {new Date(todayAttendance.checkInTime).toLocaleTimeString()}
                </span>
              </div>
            )}

            {/* Logic Tombol Check Out (Hanya muncul jika sudah Check In tapi belum Check Out) */}
            {todayAttendance?.checkInTime && !todayAttendance?.checkOutTime && (
              <Button
                onClick={handleCheckOut}
                disabled={isCheckingOut}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                {isCheckingOut ? 'Checking Out...' : 'Check Out'}
              </Button>
            )}

            {/* Status jika sudah Check Out */}
            {todayAttendance?.checkOutTime && (
              <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-md border border-blue-200">
                <span className="font-semibold">✓ Checked out at:</span>
                <span>
                  {new Date(todayAttendance.checkOutTime).toLocaleTimeString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tabel History Absensi */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isHRorAdmin
              ? 'All Employee Attendance Records'
              : 'My Attendance History'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Jika User Biasa: Kirim user.id agar tabel hanya menampilkan data dia.
            Jika Admin: Kirim undefined agar tabel menampilkan semua data (sesuai logic komponen table kamu).
          */}
          <AttendanceRecordTable
            employeeId={isHRorAdmin ? undefined : user?.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
