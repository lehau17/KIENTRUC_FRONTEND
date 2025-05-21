import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'api/instance';

export const useUploadMultipleFiles = () => {
    return useMutation({
        mutationFn: async (formData) => {
            const response = await axiosInstance.post('/upload/s3-multiple', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            console.log('✅ Upload successful:', data);
        },
        onError: (error) => {
            console.error('❌ Upload failed:', error.message);
        },
    });
};
