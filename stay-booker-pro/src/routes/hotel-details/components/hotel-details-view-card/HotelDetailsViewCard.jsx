import { useRoomReviews } from 'hooks/useReview';
import ReactImageGallery from 'react-image-gallery';
import HotelBookingDetailsCard from '../hotel-booking-details-card/HotelBookingDetailsCard';
import UserReviews from '../user-reviews/UserReviews';

const HotelDetailsViewCard = ({ hotelDetails }) => {
    // 🚀 Lấy dữ liệu reviews thông qua TanStack Query
    const { data: reviewData, isLoading, isError } = useRoomReviews(hotelDetails._id);

    // Chuyển đổi ảnh thành định dạng ReactImageGallery
    const images = hotelDetails.images.map((image) => ({
        original: image,
        thumbnail: image,
        thumbnailClass: 'h-[80px]',
        thumbnailLoading: 'lazy',
    }));

    // Xử lý lỗi khi gọi API
    if (isError) {
        return <div className="text-red-500">❌ Failed to load reviews</div>;
    }

    return (
        <div className="flex items-start justify-center flex-wrap md:flex-nowrap container mx-auto p-4">
            <div className="w-[800px] bg-white shadow-lg rounded-lg overflow-hidden">
                <div>
                    <div className="relative w-full">
                        <ReactImageGallery
                            items={images}
                            showPlayButton={false}
                            showFullscreenButton={false}
                        />
                        {hotelDetails?.discount > 0 && (
                            <div className="absolute top-0 right-0 m-4 px-2 py-1 bg-yellow-500 text-white font-semibold text-xs rounded">
                                {hotelDetails?.discount}% OFF
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                            {hotelDetails?.name}
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Room Type: {hotelDetails?.roomType} | Status: {hotelDetails?.status}
                        </p>
                        <div className="mt-2 space-y-2">
                            <p className="text-gray-700">
                                Capacity: {hotelDetails?.capacity} people
                            </p>
                            <p className="text-gray-700">
                                Price: ${hotelDetails?.price}
                            </p>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <div>
                                <p className="text-sm text-gray-600">
                                    {hotelDetails?.amenities.length > 0
                                        ? hotelDetails?.amenities.join(' | ')
                                        : 'No amenities available'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <UserReviews reviewData={reviewData} isLoading={isLoading} />
            </div>

            <HotelBookingDetailsCard hotelCode={hotelDetails?._id} />
        </div>
    );
};

export default HotelDetailsViewCard;
