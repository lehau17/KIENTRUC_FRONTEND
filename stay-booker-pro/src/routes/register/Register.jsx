import { yupResolver } from '@hookform/resolvers/yup';
import axiosInstance from 'api/instance';
import Toast from 'components/ux/toast/Toast';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';


const schema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
        .matches(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
        .matches(/\d/, 'Mật khẩu phải có ít nhất 1 số')
        .matches(/[@$!%*?&#]/, 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt (@, $, !, %, *, ?, & or #)')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});



const Register = () => {
    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [showToast, setShowToast] = useState(false);

    // ✅ Sử dụng React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    /**
     * Submit form đăng ký
     */
    const onSubmit = async (values) => {
        const payload = {
            username: values.email.split('@')[0],
            password: values.password,
            email: values.email,
            fullname: `${values.firstName} ${values.lastName}`,
        };

        try {
            const response = await axiosInstance.post('/auth/register', payload);
            if (response && response.data) {
                setToastMessage('Registration successful!');
                setToastType('success');
                setShowToast(true);
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            setToastType('error');
            // ✅ Lấy message từ object lỗi của server
            setToastMessage('Registration failed!');
            setShowToast(true);
        }
    };

    return (
        <>
            <div className="register__form">
                <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full max-w-lg p-4 shadow-md md:p-10"
                    >
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-extrabold text-brand">
                                Join the Adventure!
                            </h2>
                            <p className="text-gray-500">
                                Create your account and start your journey with us
                            </p>
                        </div>
                        <div className="flex flex-wrap mb-6 -mx-3">
                            <div className="w-full px-3 mb-6 md:w-1/2 md:mb-0 relative">
                                <input
                                    {...register('firstName')}
                                    placeholder="First Name"
                                    autoComplete="given-name"
                                    className={`border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white ${errors.firstName ? 'border-red-500' : ''
                                        }`}
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>
                            <div className="w-full px-3 md:w-1/2">
                                <input
                                    {...register('lastName')}
                                    placeholder="Last Name"
                                    autoComplete="family-name"
                                    className={`border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white ${errors.lastName ? 'border-red-500' : ''
                                        }`}
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-sm">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mb-6">
                            <input
                                {...register('email')}
                                placeholder="Email"
                                autoComplete="email"
                                className={`border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white ${errors.email ? 'border-red-500' : ''
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="mb-6">
                            <input
                                {...register('password')}
                                placeholder="Password"
                                autoComplete="new-password"
                                type="password"
                                className={`border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white ${errors.password ? 'border-red-500' : ''
                                    }`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <div className="mb-6">
                            <input
                                {...register('confirmPassword')}
                                placeholder="Confirm Password"
                                autoComplete="new-password"
                                type="password"
                                className={`border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white ${errors.confirmPassword ? 'border-red-500' : ''
                                    }`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center w-full my-3">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 font-bold text-white rounded bg-brand hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                        <Link
                            to="/login"
                            className="inline-block w-full text-lg text-center text-gray-500 align-baseline hover:text-blue-800"
                        >
                            Back to login
                        </Link>
                        {showToast && (
                            <Toast
                                type={toastType}
                                message={toastMessage}
                                dismissError
                            />
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
