import { useRoomDetail } from 'hooks/useRooms';
import { useParams } from 'react-router-dom';
import HotelDetailsViewCardSkeleton from './components/hotel-details-view-card-skeleton/HotelDetailsViewCardSkeleton';
import HotelDetailsViewCard from './components/hotel-details-view-card/HotelDetailsViewCard';


const HotelDetails = () => {
    const { hotelId } = useParams();

    const { data, isLoading, isError, error } = useRoomDetail(hotelId);

    if (isLoading) {
        return <HotelDetailsViewCardSkeleton />;
    }

    if (isError) {
        return (
            <div className="text-red-500">
                ❌ Failed to load hotel details: {error.message}
            </div>
        );
    }

    return <HotelDetailsViewCard hotelDetails={data.data} />;
};

export default HotelDetails;
