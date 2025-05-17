// hooks/useEmployees.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'api/instance';

export const useEmployees = () => {
    return useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const response = await axiosInstance.get('/api/employees');
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
            const response = await axiosInstance.post('/api/employees', newEmployee);
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
        mutationFn: async (updatedEmployee) => {
            const response = await axiosInstance.put(`/api/employees/${updatedEmployee._id}`, updatedEmployee);
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
            await axiosInstance.delete(`/api/employees/${employeeId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
        },
    });
};
