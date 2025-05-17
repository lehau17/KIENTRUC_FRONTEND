import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Thêm interceptor để tự động thêm token vào header nếu có
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Xử lý lỗi response từ server
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Request đã gửi nhưng server trả lỗi (4xx, 5xx)
            console.error('API Error:', error.response.data.message);
        } else if (error.request) {
            // Request đã gửi nhưng không nhận được phản hồi
            console.error('Network Error:', error.message);
        } else {
            // Lỗi khác
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
