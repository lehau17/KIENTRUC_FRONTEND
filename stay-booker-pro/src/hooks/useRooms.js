import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'api/instance';

/**
 * useRooms - Hook để lấy danh sách phòng từ API
 * @param {Object} filters - Các thông tin filter (giá, loại phòng, trạng thái, phân trang, ...)
 * @param {number} page - Trang hiện tại, mặc định là 1
 * @param {number} limit - Số lượng item mỗi trang, mặc định là 40
 * @returns {Object} data, isLoading, isError, error
 */
export const useRooms = (filters = {}, page = 1, limit = 40) => {
    // 🚀 **Tạo queryKey để React Query quản lý cache thông minh**
    const queryKey = ['rooms', filters, page, limit];

    return useQuery({
        queryKey: queryKey,
        queryFn: async () => {
            // 🚀 **Kết hợp params với pagination**
            const params = {
                ...filters,
                page: page,
                limit: limit,
            };
            console.log("check param:::", params)

            // ✅ **Gọi API**
            const response = await axiosInstance.get('/room', { params });

            console.log("🔍 Data rooms response: ", response.data.data);

            // ✅ **Trả về dữ liệu**
            return {
                data: response.data,
                pagination: response.data.pagination,
            };
        },
        staleTime: 300000, // Cache trong 5 phút
        keepPreviousData: true, // Giữ dữ liệu cũ khi gọi query mới
    });
};



export const useRoomDetail = (id) => {
    const queryKey = ['room-detail', id];

    return useQuery({
        queryKey: queryKey,
        queryFn: async () => {
            const response = await axiosInstance.get(`/room/${id}`);
            console.log(response.data)
            return response.data
        },
    });
};

