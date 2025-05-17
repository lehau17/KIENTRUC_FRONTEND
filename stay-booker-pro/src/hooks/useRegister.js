// hooks/useRegister.js
import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'api/instance';

const useRegister = () => {
    return useMutation({
        mutationFn: async (values) => {
            const payload = {
                username: values.email.split('@')[0],
                password: values.password,
                email: values.email,
                fullname: `${values.firstName} ${values.lastName}`,
            };

            const response = await axiosInstance.post('/auth/register', payload);
            return response.data;
        },
        onSuccess: (data) => {
            console.log('Registration successful:', data);
        },
        onError: (error) => {
            console.error('Registration failed:', error.response.data.message);
        },
    });
};

export default useRegister;
