import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'api/instance';


export const useLogin = () => {
    return useMutation({
        mutationFn: async (loginData) => {
            const response = await axiosInstance.post('/auth/login', loginData);
            return response.data;
        },
        onSuccess: (data) => {
            console.log('Login Success:', data);
            localStorage.setItem('accessToken', data.data.tokens.accessToken);
            localStorage.setItem("userInfo", JSON.stringify(data.data.info))

        },
        onError: (error) => {
            console.error('Login Failed:', error.message);
        },
    });
};
