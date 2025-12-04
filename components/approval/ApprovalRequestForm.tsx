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
import { CreateApprovalRequestData } from '@/hooks/use-approvals';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const approvalRequestFormSchema = z.object({
  type: z.string().min(2, { message: 'Request type must be at least 2 characters.' }),
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters.' }),
});

interface ApprovalRequestFormProps {
  onSubmit: (data: CreateApprovalRequestData) => Promise<void>;
  isLoading: boolean;
}

export function ApprovalRequestForm({ onSubmit, isLoading }: ApprovalRequestFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof approvalRequestFormSchema>>({
    resolver: zodResolver(approvalRequestFormSchema),
    defaultValues: {
      type: '',
      title: '',
      description: '',
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof approvalRequestFormSchema>) => {
    try {
      await onSubmit(values);
      toast({
        title: 'Success',
        description: 'Approval request created successfully.',
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="LEAVE">Leave</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Annual Leave Request" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Details of your request..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </form>
    </Form>
  );
}
