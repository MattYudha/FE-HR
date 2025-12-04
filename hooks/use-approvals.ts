import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface ApprovalRequest {
  id: string;
  employeeId: string;
  type: string; // e.g., 'LEAVE', 'EXPENSE'
  title: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  employee?: { // Assuming employee details might be nested
    fullName: string;
    position: string;
  };
}

export interface CreateApprovalRequestData {
  type: string;
  title: string;
  description: string;
}

export interface ApproveRejectApprovalRequestData {
  approvalId: string;
  notes?: string;
}

// Fetch my approval requests
export const useMyApprovalRequests = () => {
  return useQuery<ApprovalRequest[], Error>({
    queryKey: ['myApprovalRequests'],
    queryFn: async () => {
      const { data } = await api.get('/approval/my-approvals');
      return data.data; // Adjust based on actual API response structure
    },
  });
};

// Fetch all approval requests (for HR/Admin)
export const useAllApprovalRequests = (filters?: { status?: string; employeeId?: string }) => {
  return useQuery<ApprovalRequest[], Error>({
    queryKey: ['allApprovalRequests', filters],
    queryFn: async () => {
      const { data } = await api.get('/approval/requests', { params: filters }); // Assuming /approval/requests endpoint for all
      return data.data; // Adjust based on actual API response structure
    },
  });
};

// Fetch a single approval request by ID
export const useApprovalRequest = (id: string) => {
  return useQuery<ApprovalRequest, Error>({
    queryKey: ['approvalRequest', id],
    queryFn: async () => {
      const { data } = await api.get(`/approval/detail/${id}`);
      return data.data; // Adjust based on actual API response structure
    },
    enabled: !!id,
  });
};

// Create a new approval request
export const useCreateApprovalRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<ApprovalRequest, Error, CreateApprovalRequestData>({
    mutationFn: async (newRequest) => {
      const { data } = await api.post('/approval/request', newRequest);
      return data.data; // Adjust based on actual API response structure
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApprovalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allApprovalRequests'] });
    },
  });
};

// Approve an approval request
export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<ApprovalRequest, Error, ApproveRejectApprovalRequestData>({
    mutationFn: async ({ approvalId, notes }) => {
      const { data } = await api.post('/approval/approve', { approvalId, notes });
      return data.data; // Adjust based on actual API response structure
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['myApprovalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allApprovalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['approvalRequest', variables.approvalId] });
    },
  });
};

// Reject an approval request (assuming a reject endpoint exists, not in Postman but common)
export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<ApprovalRequest, Error, ApproveRejectApprovalRequestData>({
    mutationFn: async ({ approvalId, notes }) => {
      // Assuming a similar endpoint for reject, or a status update on the approve endpoint
      // For now, let's assume a separate reject endpoint or a PUT to update status
      const { data } = await api.post('/approval/reject', { approvalId, notes }); // Placeholder
      return data.data; // Adjust based on actual API response structure
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['myApprovalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allApprovalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['approvalRequest', variables.approvalId] });
    },
  });
};
