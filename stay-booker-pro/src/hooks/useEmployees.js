// hooks/useEmployees.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'api/instance';

export const useEmployees = () => {
    return useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const response = await axiosInstance.get('/employees');
            return response.data;
        },
        retry: 2,
        refetchOnWindowFocus: false,
    });
};

export const useAddEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newEmployee) => {
            const response = await axiosInstance.post('/employees', newEmployee);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
        },
    });
};

export const useUpdateEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }) => {
            const response = await axiosInstance.patch(`/employees/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
        },
    });
};

export const useDeleteEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (employeeId) => {
            await axiosInstance.delete(`/employees/${employeeId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
        },
    });
};
