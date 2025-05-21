import {
    CardElement,
    Elements,
    useElements,
    useStripe
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Loader from 'components/ux/loader/loader';
import Toast from 'components/ux/toast/Toast';
import { AuthContext } from 'contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { networkAdapter } from 'services/NetworkAdapter';
import { getReadableMonthFormat } from 'utils/date-helpers';
import FinalBookingSummary from './components/final-booking-summary/FinalBookingSummary';

const stripePromise = loadStripe('pk_test_51RP3KlRBrdlMwlulJ5t8wgP4c69WUckRnr0xyt3d1dnpXu1TB9E9AB5eVFqamk78GoIQYLK2LumE5HTjXpyV7fwm00metvjoGg');

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated, userDetails } = useContext(AuthContext);

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [toastMessage, setToastMessage] = useState('');

    // Client secret được lấy từ backend (đã tạo khi booking)
    const [clientSecret, setClientSecret] = useState('');

    const [nameOnCard, setNameOnCard] = useState('');

    // Giả sử bạn có bookingId trong URL hoặc location.state
    const bookingId = searchParams.get('bookingId') || location.state?.bookingId;

    // Lấy clientSecret từ backend dựa trên bookingId
    useEffect(() => {
        if (!bookingId) {
            setErrorMessage('Thiếu booking ID để lấy thông tin thanh toán.');
            return;
        }

        async function fetchClientSecret() {
            try {
                const response = await networkAdapter.get(`/api/payment/user/${bookingId}/pending`);

                if (response && response.data && response.data.clientSecret) {
                    setClientSecret(response.data.clientSecret);
                } else {
                    setErrorMessage('Không thể lấy client secret từ backend');
                }
            } catch (error) {
                setErrorMessage('Lỗi khi lấy client secret: ' + error.message);
            }
        }

        fetchClientSecret();
    }, [bookingId]);

    const checkInDateTime = `${getReadableMonthFormat(searchParams.get('checkIn'))}, ${location.state?.checkInTime}`;
    const checkOutDateTime = `${getReadableMonthFormat(searchParams.get('checkOut'))}, ${location.state?.checkOutTime}`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!stripe || !elements) return;

        if (!nameOnCard) {
            setErrorMessage('Vui lòng nhập tên trên thẻ');
            return;
        }

        if (!clientSecret) {
            setErrorMessage('Thiếu client secret, không thể thanh toán');
            return;
        }

        setIsProcessing(true);

        const cardElement = elements.getElement(CardElement);
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: nameOnCard,
                    email: userDetails?.email || '',
                },
            },
        });

        if (result.error) {
            setErrorMessage(result.error.message);
            setIsProcessing(false);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                // Có thể gọi backend xác nhận nếu cần
                try {
                    const res = await networkAdapter.post('/api/payment/confirm-payment', {
                        paymentIntentId: result.paymentIntent.id,
                    });

                    if (res && res.data && (!res.errors || res.errors.length === 0)) {
                        navigate(`/booking-confirmation?payment=success&hotel=${searchParams.get('hotelName')}`, {
                            state: { confirmationData: res.data },
                        });
                    } else {
                        setToastMessage('Xác nhận thanh toán backend thất bại.');
                        setIsProcessing(false);
                    }
                } catch (err) {
                    setToastMessage('Lỗi xác nhận backend: ' + err.message);
                    setIsProcessing(false);
                }
            } else {
                setErrorMessage('Thanh toán chưa hoàn tất. Trạng thái: ' + result.paymentIntent.status);
                setIsProcessing(false);
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <FinalBookingSummary
                hotelName={searchParams.get('hotelName')?.replaceAll('-', ' ')}
                checkIn={checkInDateTime}
                checkOut={checkOutDateTime}
                isAuthenticated={isAuthenticated}
                phone={userDetails?.phone}
                email={userDetails?.email}
                fullName={userDetails?.fullName}
            />
            <div className="relative bg-white border shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto">
                {isProcessing && <Loader isFullScreen={true} loaderText="Đang xử lý thanh toán..." />}
                <form onSubmit={handleSubmit} className={isProcessing ? 'opacity-50 pointer-events-none' : ''}>
                    <div className="mb-4">
                        <label htmlFor="nameOnCard" className="block text-gray-700 text-sm font-bold mb-2">
                            Tên trên thẻ
                        </label>
                        <input
                            id="nameOnCard"
                            type="text"
                            value={nameOnCard}
                            onChange={(e) => setNameOnCard(e.target.value)}
                            placeholder="Nhập tên trên thẻ"
                            required
                            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Thông tin thẻ</label>
                        <div className="border border-gray-300 rounded p-3">
                            <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!stripe || isProcessing}
                        className={`bg-brand hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition duration-300 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        Pay ₹ {location.state?.total}
                    </button>

                    {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                    {toastMessage && (
                        <div className="my-4">
                            <Toast message={toastMessage} type="error" dismissError={() => setToastMessage('')} />
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

const Checkout = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default Checkout;
