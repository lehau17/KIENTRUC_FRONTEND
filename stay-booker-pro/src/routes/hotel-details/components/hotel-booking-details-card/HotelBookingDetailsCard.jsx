import DateRangePicker from 'components/ux/data-range-picker/DateRangePicker';
import Toast from 'components/ux/toast/Toast';
import { AuthContext } from 'contexts/AuthContext'; // giả sử file bạn lưu là vậy
import { differenceInCalendarDays } from 'date-fns';
import format from 'date-fns/format';
import { useCreateBooking } from 'hooks/useBooking';
import { useRoomDetail } from 'hooks/useRooms';
import queryString from 'query-string';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { DEFAULT_TAX_DETAILS } from 'utils/constants';
import { formatPrice } from 'utils/price-helpers';

const HotelBookingDetailsCard = ({ hotelCode }) => {
    // State for date picker visibility
    const [isDatePickerVisible, setisDatePickerVisible] = useState(false);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const { userDetails } = useContext(AuthContext);
    const { mutate: createBooking, isPending } = useCreateBooking();


    // State for date range
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection',
        },
    ]);

    // State for selected room, guests, and rooms
    const [selectedGuests, setSelectedGuests] = useState({
        value: 2,
        label: '2 guests',
    });
    const [selectedRooms, setSelectedRooms] = useState({
        value: 1,
        label: '1 room',
    });

    const [total, setTotal] = useState(0);
    const [taxes, setTaxes] = useState(0);
    const [bookingPeriodDays, setBookingPeriodDays] = useState(1);

    // Fetch room details
    const { data: dataDetail, isLoading } = useRoomDetail(hotelCode);
    let bookingDetails = dataDetail?.data
    // Options for guests and rooms
    const guestOptions = Array.from(
        { length: bookingDetails.capacity },
        (_, i) => ({ value: i + 1, label: `${i + 1} guest` })
    );
    const roomNumberOptions = Array.from(
        { length: 5 },
        (_, i) => ({ value: i + 1, label: `${i + 1} room` })
    );

    // Handler for date picker visibility toggle
    const onDatePickerIconClick = () => {
        setisDatePickerVisible(!isDatePickerVisible);
    };

    const onDateChangeHandler = (ranges) => {
        const { startDate, endDate } = ranges.selection;
        setDateRange([ranges.selection]);
        const days = startDate && endDate ? differenceInCalendarDays(endDate, startDate) + 1 : 1;
        setBookingPeriodDays(days);
        calculatePrices();
    };

    const handleGuestsNumberChange = (selectedOption) => {
        setSelectedGuests(selectedOption);
    };
    const handleRoomsNumberChange = (selectedOption) => {
        setSelectedRooms(selectedOption);
        calculatePrices();
    };

    /**
     * 🔎 Tính toán giá tiền và thuế
     */
    const calculatePrices = () => {
        if (!bookingDetails) return;

        const pricePerNight = bookingDetails.price * selectedRooms.value;
        const gstRate = pricePerNight <= 2500 ? 0.12 : pricePerNight > 7500 ? 0.18 : 0.12;
        const totalGst = (pricePerNight * bookingPeriodDays * gstRate).toFixed(2);
        const totalPrice = (pricePerNight * bookingPeriodDays + parseFloat(totalGst)).toFixed(2);

        if (!isNaN(totalPrice)) {
            setTotal(`${formatPrice(totalPrice)} $`);
        }
        setTaxes(`${formatPrice(totalGst)} $`);
    };



    const onBookingConfirm = () => {
        if (!dateRange[0].startDate || !dateRange[0].endDate) {
            setErrorMessage('Please select check-in and check-out dates.');
            return;
        }

        const checkIn = format(dateRange[0].startDate, 'yyyy-MM-dd');
        const checkOut = format(dateRange[0].endDate, 'yyyy-MM-dd');

        const payload = {
            userId: userDetails?.id || 'anonymous',
            roomId: hotelCode,
            checkInAt: checkIn,
            checkOutAt: checkOut,
            price: Number(total.split(" ")[0]),
            paymentMethod: "stripe"
        };

        createBooking(payload, {
            onSuccess: (data) => {
                console.log(data)
                const queryParams = {
                    hotelCode,
                    checkIn: format(dateRange[0].startDate, 'dd-MM-yyyy'),
                    checkOut: format(dateRange[0].endDate, 'dd-MM-yyyy'),
                    guests: selectedGuests.value,
                    rooms: selectedRooms.value,
                    hotelName: bookingDetails.name.replaceAll(' ', '-'),
                    bookingId: data.data.id
                };

                navigate(`/checkout?${queryString.stringify(queryParams)}`, {
                    state: {
                        total,
                        checkInTime: '14:00',
                        checkOutTime: '12:00',
                    },
                });
            },
            onError: (error) => {
                console.log(error)
                setErrorMessage(error.response?.data?.message || 'Booking failed');
            },
        });
    };


    const dismissError = () => {
        setErrorMessage('');
    };

    useEffect(() => {
        calculatePrices();
    }, [bookingPeriodDays, selectedRooms, bookingDetails]);

    return (
        <div className="mx-2 bg-white shadow-xl rounded-xl overflow-hidden mt-2 md:mt-0 w-full md:w-[380px]">
            <div className="px-6 py-4 bg-brand text-white">
                <h2 className="text-xl font-bold">Booking Details</h2>
            </div>
            <div className="p-6 text-sm md:text-base">
                <div className="mb-4">
                    <div className="text-lg font-semibold text-gray-800 mb-1">
                        Total Price
                    </div>
                    <div className="text-xl font-bold text-indigo-600">{total}</div>
                </div>

                <div className="mb-4">
                    <div className="font-semibold text-gray-800">Dates & Time</div>
                    <DateRangePicker
                        isDatePickerVisible={isDatePickerVisible}
                        onDatePickerIconClick={onDatePickerIconClick}
                        onDateChangeHandler={onDateChangeHandler}
                        setisDatePickerVisible={setisDatePickerVisible}
                        dateRange={dateRange}
                        inputStyle="DARK"
                    />
                </div>

                <div className="mb-4">
                    <div className="font-semibold text-gray-800">Reservation</div>
                    <Select
                        value={selectedRooms}
                        onChange={handleRoomsNumberChange}
                        options={roomNumberOptions}
                        className="mb-2"
                    />
                    <Select
                        value={selectedGuests}
                        onChange={handleGuestsNumberChange}
                        options={guestOptions}
                    />
                </div>

                <div className="mb-4">
                    <div className="font-semibold text-gray-800">Per day rate</div>
                    <div className="text-gray-600">
                        {formatPrice(bookingDetails.price)} VND
                    </div>
                </div>

                <div className="mb-4">
                    <div className="font-semibold text-gray-800">Taxes</div>
                    <div className="text-gray-600">{taxes}</div>
                    <div className="text-xs text-gray-500">{DEFAULT_TAX_DETAILS}</div>
                </div>

                {errorMessage && (
                    <Toast
                        type="error"
                        message={errorMessage}
                        dismissError={dismissError}
                    />
                )}
            </div>
            <div className="px-6 py-4 bg-gray-50">
                <button
                    onClick={onBookingConfirm}
                    className="w-full bg-brand-secondary text-white py-2 rounded hover:bg-yellow-600 transition duration-300"
                >
                    Confirm Booking
                </button>
            </div>
        </div>
    );
};

export default HotelBookingDetailsCard;
