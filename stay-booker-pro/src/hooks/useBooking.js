// hooks/useBooking.ts
import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'api/instance';

export const useCreateBooking = () => {
    return useMutation({
        mutationFn: async (payload) => {
            const response = await axiosInstance.post(`/bookings`, payload);
            return response.data;
        },
        onSuccess: (data) => {
            console.log('✅ Booking created:', data);
        },
        onError: (error) => {
            console.error('❌ Booking failed:', error.response?.data?.message || error.message);
        },
    });
};
