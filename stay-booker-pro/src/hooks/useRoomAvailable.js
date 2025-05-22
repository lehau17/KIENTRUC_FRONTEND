import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'api/instance';

export const useRoomsAvailable = ({
    checkInAt,
    checkOutAt,
}) => {
    const queryKey = ['rooms', checkInAt, checkOutAt];

    return useQuery({
        queryKey,
        queryFn: async () => {
            const params = {
                checkInAt,
                checkOutAt,
            };

            console.log("📅 Params:", params);

            const response = await axiosInstance.get('/bookings/available-rooms', { params });

            console.log("✅ Rooms response:", response.data.data);

            return {
                data: response.data,
            };
        },
        keepPreviousData: true,
    });
};
