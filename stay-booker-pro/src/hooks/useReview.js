import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from 'api/instance';


export const useCreateReview = () => {
    return useMutation({
        mutationFn: async ({ roomId, review }) => {
            const response = await axiosInstance.post(`/review`, {
                comment: review.content,
                rating: review.rating,
                roomId
            });
            return response.data;
        },
        onSuccess: (data) => {
            console.log('✅ Review submitted successfully:', data);
        },
        onError: (error) => {
            console.error('❌ Review submission failed:', error.response.data.message);
        },
    });
};



export const useRoomReviews = (roomId) => {
    return useQuery({
        queryKey: ['room-reviews', roomId],
        queryFn: async () => {
            const response = await axiosInstance.get(`/review/${roomId}`);
            return response.data;
        },
        retry: 2,
        refetchOnWindowFocus: false,
    });
};


