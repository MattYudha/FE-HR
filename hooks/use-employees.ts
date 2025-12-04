import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Employee {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  address: string;
  position: string;
  department: string;
  baseSalary: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeData {
  userId: string;
  fullName: string;
  phone: string;
  address: string;
  position: string;
  department: string;
  baseSalary: number;
}

export interface UpdateEmployeeData {
  fullName?: string;
  phone?: string;
  address?: string;
  position?: string;
  department?: string;
  baseSalary?: number;
}

// Fetch all employees
export const useEmployees = () => {
  return useQuery<Employee[], Error>({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await api.get('/employees');
      return data.data; // Adjust based on actual API response structure
    },
  });
};

// Fetch a single employee by ID
export const useEmployee = (id: string) => {
  return useQuery<Employee, Error>({
    queryKey: ['employee', id],
    queryFn: async () => {
      const { data } = await api.get(`/employees/${id}`);
      return data.data; // Adjust based on actual API response structure
    },
    enabled: !!id, // Only run query if id is available
  });
};

// Create a new employee
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation<Employee, Error, CreateEmployeeData>({
    mutationFn: async (newEmployee) => {
      const { data } = await api.post('/employees', newEmployee);
      return data.data; // Adjust based on actual API response structure
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] }); // Invalidate and refetch all employees
    },
  });
};

// Update an existing employee
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation<Employee, Error, { id: string; data: UpdateEmployeeData }>({
    mutationFn: async ({ id, data: updatedData }) => {
      const { data } = await api.put(`/employees/${id}`, updatedData);
      return data.data; // Adjust based on actual API response structure
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
    },
  });
};

// Delete an employee (assuming a delete endpoint exists, not in Postman but common)
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
