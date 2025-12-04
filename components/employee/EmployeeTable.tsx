import { useEmployees, Employee } from '@/hooks/use-employees';
import { Loader } from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export function EmployeeTable() {
  const { data: employees, isLoading, error } = useEmployees();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">Error loading employees: {error.message}</div>;
  }

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold">Employees</h2>
        <Link href="/employees/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </Link>
      </div>
      <table className="w-full text-left">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Full Name</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Email</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Position</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Department</th>
            <th className="h-12 px-4 text-sm font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Actions</th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {employees && employees.length > 0 ? (
            employees.map((employee) => (
              <tr key={employee.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium">{employee.fullName}</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{employee.userId}</td> {/* Assuming userId is email for now */}
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{employee.position}</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{employee.department}</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <Link href={`/employees/${employee.id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-center text-muted-foreground">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
