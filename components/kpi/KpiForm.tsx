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
import { CreateKpiData } from '@/hooks/use-kpi';
import { useToast } from '@/components/ui/use-toast';
import { useEmployees } from '@/hooks/use-employees';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from '@/components/shared/Loader';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

const kpiFormSchema = z.object({
  employeeId: z.string().uuid({ message: 'Please select an employee.' }),
  period: z.string().regex(/^\d{4}-\d{2}$/, { message: 'Period must be in YYYY-MM format.' }),
  score: z.coerce.number().min(0).max(100, { message: 'Score must be between 0 and 100.' }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
  notes: z.string().optional(),
});

interface KpiFormProps {
  onSubmit: (data: CreateKpiData) => Promise<void>;
  isLoading: boolean;
}

export function KpiForm({ onSubmit, isLoading }: KpiFormProps) {
  const { toast } = useToast();
  const { data: employees, isLoading: employeesLoading, error: employeesError } = useEmployees();

  const form = useForm<z.infer<typeof kpiFormSchema>>({
    resolver: zodResolver(kpiFormSchema),
    defaultValues: {
      employeeId: '',
      period: format(new Date(), 'yyyy-MM'), // Default to current month
      score: 0,
      category: '',
      notes: '',
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof kpiFormSchema>) => {
    try {
      await onSubmit(values);
      toast({
        title: 'Success',
        description: 'KPI created successfully.',
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
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score (0-100)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="85" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Performance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Kinerja sangat baik" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create KPI'}
        </Button>
      </form>
    </Form>
  );
}
