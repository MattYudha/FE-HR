export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  status: string;
  salary: number;
  joinDate: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  period: string;
  basicSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  status: string;
  paymentDate: string | null;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  profilePictureUrl?: string;
}

export interface DepartmentalRecap {
  department: string;
  totalSalary: number;
  totalPph21: number;
  totalTakeHomePay: number;
  employeeCount: number;
}

export interface PayrollRecap {
  period: string;
  totalPayroll: number;
  totalTax: number;
  totalNet: number;
  totalEmployeesPaid: number;
  departmentalRecap: DepartmentalRecap[];
}

export interface KPI {
  id: string;
  employeeId: string;
  employeeName: string;
  score: number;
  target: number;
  period: string;
  lastUpdated: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: string;
  checkIn: string | null;
  checkOut: string | null;
}

export interface AttendanceSummary {
  totalEmployees: number;
  present: number;
  absent: number;
  late: number;
  rate: number;
}

export interface Approval {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: string;
  submittedAt: string;
  reviewedAt: string | null;
  reviewerNotes: string | null;
}
