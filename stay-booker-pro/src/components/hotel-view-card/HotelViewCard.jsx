import { faCheck, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from 'utils/price-helpers';

/**
 * HotelViewCard Component
 * Renders a card view for a hotel, displaying its image, title, amenities, price, and ratings.
 * Provides a 'Book now' button to navigate to the hotel's detailed view.
 *
 * @param {Object} props - Props for the component.
 * @param {string} props.id - The unique code of the hotel.
 * @param {Object} props.hotel - The hotel object containing all hotel details.
 */
const HotelViewCard = (props) => {
    const {
        _id: hotelCode,
        hotel,
    } = props;

    const navigate = useNavigate();

    const onBookNowClick = () => {
        navigate(`/hotel/${hotel._id}`);
    };

    return (
        <div
            className="card border p-4 flex flex-col md:flex-row gap-x-2 w-full"
            data-testid="hotel-view-card"
        >
            {/* Image */}
            <div className="cursor-pointer">
                <Link
                    to={`/hotel/${hotelCode}`}
                    className="block text-slate-700 hover:text-brand transition-colors duration-300"
                >
                    <img
                        src={hotel.images[0]} // Lấy hình đầu tiên trong mảng images
                        alt={hotel.name}
                        className="md:w-[220px] md:h-[140px] object-cover rounded"
                    />
                </Link>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between ml-0 md:ml-2 flex-1">
                <div>
                    <Link
                        to={`/hotel/${hotelCode}`}
                        className="block text-slate-700 hover:text-brand transition-colors duration-300"
                    >
                        <h4 className="text-2xl font-bold text-slate-600">{hotel.name}</h4>
                    </Link>
                    <p className="text-slate-600 text-sm">{hotel.roomType}</p>
                </div>

                {/* Amenities List */}
                <ul className="grid grid-cols-2 gap-1 mt-2">
                    {hotel.amenities.length > 0 ? (
                        hotel.amenities.map((amenity, index) => (
                            <li className="text-green-800 font-medium text-sm flex items-center" key={index}>
                                <FontAwesomeIcon icon={faCheck} className="mr-2" /> {amenity}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500 text-sm">No amenities available</li>
                    )}
                </ul>
            </div>

            {/* Price & Book */}
            <div className="flex flex-col ml-0 md:ml-auto justify-between border-l-0 md:border-l-2 items-stretch pl-0 md:pl-4">
                <div className="flex justify-between my-3 md:my-0 items-center md:flex-col md:justify-between w-full h-full">
                    <h4 className="font-medium text-sm text-white bg-brand p-2">
                        {hotel.rating} <FontAwesomeIcon icon={faStar} />
                    </h4>
                    <p className="text-slate-600 font-bold whitespace-nowrap">
                        ₹ {formatPrice(hotel.price)}
                    </p>
                </div>
                <button
                    className="bg-brand-secondary px-4 py-2 text-white whitespace-nowrap"
                    onClick={onBookNowClick}
                >
                    Book now
                </button>
            </div>
        </div>
    );
};

export default HotelViewCard;
