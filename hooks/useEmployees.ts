import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Employee } from '@/src/types';

// Fetch all employees
const fetchEmployees = async (): Promise<Employee[]> => {
  // PERBAIKAN: Hapus '/api', jadi '/employees' saja
  const response = await apiClient.get('/employees');
  return response.data;
};

// Fetch Single Employee
const fetchEmployeeById = async (id: string): Promise<Employee> => {
  const response = await apiClient.get(`/employees/${id}`); // Hapus '/api'
  return response.data;
};

export const useEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });
};

export const useEmployee = (id: string) => {
  return useQuery<Employee, Error>({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployeeById(id),
    enabled: !!id,
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (employeeId: string) =>
      apiClient.delete(`/employees/${employeeId}`), // Hapus '/api'
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) =>
      apiClient.put(`/employees/${id}`, data), // Hapus '/api'
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
    },
  });
};
