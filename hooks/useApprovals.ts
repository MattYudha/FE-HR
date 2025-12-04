import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Approval } from '@/src/types';

const fetchApprovals = async (): Promise<Approval[]> => {
  const response = await apiClient.get('/approval');
  return response.data;
};

const fetchApprovalById = async (id: string): Promise<Approval> => {
  const response = await apiClient.get(`/approval/${id}`);
  return response.data;
};

interface UpdateApprovalStatusVars {
  id: string;
  status: 'approved' | 'rejected';
  reviewerNotes?: string;
}

const updateApprovalStatus = async ({ id, status, reviewerNotes }: UpdateApprovalStatusVars): Promise<Approval> => {
  const response = await apiClient.post(`/api/approval/approve`, { id, status, reviewerNotes });
  return response.data;
};

export const useApprovals = () => {
  return useQuery<Approval[]>({
    queryKey: ['approvals'],
    queryFn: fetchApprovals,
  });
};

export const useApproval = (id: string) => {
  return useQuery<Approval>({
    queryKey: ['approval', id],
    queryFn: () => fetchApprovalById(id),
    enabled: !!id,
  });
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; reviewerNotes?: string }) =>
      updateApprovalStatus({ ...vars, status: 'approved' }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['approval', data.id] });
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; reviewerNotes?: string }) =>
      updateApprovalStatus({ ...vars, status: 'rejected' }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['approval', data.id] });
    },
  });
};
