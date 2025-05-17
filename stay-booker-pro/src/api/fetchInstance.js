// fetchInstance.js

const BASE_URL = 'http://localhost:8000/api';

const fetchInstance = async (url, options = {}) => {
    // Lấy token từ LocalStorage nếu có
    const token = localStorage.getItem('accessToken');

    // Cấu hình mặc định cho fetch
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }), // Thêm Authorization nếu có token
        },
        ...options,
    };

    // Nếu có body và là object, chuyển thành JSON
    if (defaultOptions.body && typeof defaultOptions.body === 'object') {
        defaultOptions.body = JSON.stringify(defaultOptions.body);
    }

    try {
        // Thực hiện fetch
        const response = await fetch(`${BASE_URL}${url}`, defaultOptions);

        // Kiểm tra nếu status là lỗi
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData.message || 'Unknown error');
            throw new Error(errorData.message || 'Unknown error');
        }

        // Nếu thành công, parse JSON
        return await response.json();
    } catch (error) {
        if (error.name === 'TypeError') {
            console.error('Network Error:', error.message);
        } else {
            console.error('Error:', error.message);
        }
        throw error;
    }
};

export default fetchInstance;
