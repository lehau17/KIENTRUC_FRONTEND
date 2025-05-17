import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BookingConfirmation from 'routes/booking-confimation/BookingConifrmation';
import Checkout from 'routes/checkout/Checkout';
import { AuthProvider } from './contexts/AuthContext';
import './index.scss';
import { makeServer } from './mirage/mirageServer';
import reportWebVitals from './reportWebVitals';
import AboutUs from './routes/about-us/AboutUs';
import ForgotPassword from './routes/forgot-password/ForgotPassword';
import Home from './routes/home/Home';
import HotelDetails from './routes/hotel-details/HotelDetails';
import BaseLayout from './routes/layouts/base-layout/BaseLayout';
import HotelsSearch from './routes/listings/HotelsSearch';
import Login from './routes/login/Login';
import Register from './routes/register/Register';
import UserProfile from './routes/user-profile/UserProfile';

// if (process.env.NODE_ENV === 'development') {
//   makeServer();
// }



const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2, // Thử lại 2 lần nếu lỗi
            refetchOnWindowFocus: false, // Không refetch khi focus lại window
        },
    },
});

makeServer();

const router = createBrowserRouter([
    {
        path: '/',
        element: <BaseLayout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/hotels',
                element: <HotelsSearch />,
            },
            {
                path: '/about-us',
                element: <AboutUs />,
            },
            {
                path: '/user-profile',
                element: <UserProfile />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
            {
                path: '/hotel/:hotelId',
                element: <HotelDetails />,
            },
            {
                path: '/forgot-password',
                element: <ForgotPassword />,
            },
            {
                path: '/checkout',
                element: <Checkout />,
            },
            {
                path: '/booking-confirmation',
                element: <BookingConfirmation />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </QueryClientProvider>
);


reportWebVitals();
