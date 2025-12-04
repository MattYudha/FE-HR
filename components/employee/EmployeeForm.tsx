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
import { Employee, CreateEmployeeData, UpdateEmployeeData } from '@/hooks/use-employees';
import { useToast } from '@/components/ui/use-toast';

const employeeFormSchema = z.object({
  userId: z.string().uuid().optional(), // Optional for update, required for create
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  position: z.string().min(2, { message: 'Position must be at least 2 characters.' }),
  department: z.string().min(2, { message: 'Department must be at least 2 characters.' }),
  baseSalary: z.coerce.number().min(0, { message: 'Base salary must be a positive number.' }),
});

interface EmployeeFormProps {
  initialData?: Employee; // For editing existing employee
  onSubmit: (data: CreateEmployeeData | UpdateEmployeeData) => Promise<void>;
  isLoading: boolean;
}

export function EmployeeForm({ initialData, onSubmit, isLoading }: EmployeeFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      baseSalary: initialData.baseSalary,
    } : {
      userId: '',
      fullName: '',
      phone: '',
      address: '',
      position: '',
      department: '',
      baseSalary: 0,
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof employeeFormSchema>) => {
    try {
      await onSubmit(values);
      toast({
        title: 'Success',
        description: initialData ? 'Employee updated successfully.' : 'Employee created successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        {!initialData && (
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID (Email)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., user@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="08123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Jl. Contoh No. 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="IT" {...field} />
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Employee' : 'Create Employee'}
        </Button>
      </form>
    </Form>
  );
}
