'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { CreatePayrollData } from '@/hooks/use-payroll';
import { useToast } from '@/components/ui/use-toast';
import { useEmployees } from '@/hooks/use-employees';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from '@/components/shared/Loader';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

const payrollFormSchema = z.object({
  employeeId: z.string().uuid({ message: 'Please select an employee.' }),
  period: z.string().regex(/^\d{4}-\d{2}$/, { message: 'Period must be in YYYY-MM format.' }),
  baseSalary: z.coerce.number().min(0, { message: 'Base salary must be a positive number.' }),
  allowances: z.coerce.number().min(0, { message: 'Allowances must be a positive number.' }),
  deductions: z.coerce.number().min(0, { message: 'Deductions must be a positive number.' }),
});

interface PayrollFormProps {
  onSubmit: (data: CreatePayrollData) => Promise<void>;
  isLoading: boolean;
}

export function PayrollForm({ onSubmit, isLoading }: PayrollFormProps) {
  const { toast } = useToast();
  const { data: employees, isLoading: employeesLoading, error: employeesError } = useEmployees();

  const form = useForm<z.infer<typeof payrollFormSchema>>({
    resolver: zodResolver(payrollFormSchema),
    defaultValues: {
      employeeId: '',
      period: format(new Date(), 'yyyy-MM'), // Default to current month
      baseSalary: 0,
      allowances: 0,
      deductions: 0,
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof payrollFormSchema>) => {
    try {
      await onSubmit(values);
      toast({
        title: 'Success',
        description: 'Payroll created successfully.',
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  if (employeesLoading) {
    return <Loader />;
  }

  if (employeesError) {
    return <div className="text-red-500">Error loading employees: {employeesError.message}</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employees?.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.fullName} ({employee.position})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Period (YYYY-MM)</FormLabel>
              <FormControl>
                <Input placeholder="2023-12" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="baseSalary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Salary</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5000000" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="allowances"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allowances</FormLabel>
              <FormControl>
                <Input type="number" placeholder="500000" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deductions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deductions</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100000" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Payroll'}
        </Button>
      </form>
    </Form>
  );
}
