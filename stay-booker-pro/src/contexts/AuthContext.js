import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

/**
 * Provides authentication state and user details to the application.
 */
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [authCheckTrigger, setAuthCheckTrigger] = useState(false);

    /**
     * Kiểm tra trạng thái đăng nhập khi được trigger
     */
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('accessToken');
            const userInfo = localStorage.getItem('userInfo');
            if (token && userInfo) {
                setIsAuthenticated(true);
                setUserDetails(JSON.parse(userInfo));
            } else {
                setIsAuthenticated(false);
                setUserDetails(null);
            }
        };

        checkAuthStatus();
    }, [authCheckTrigger]);

    const triggerAuthCheck = () => {
        setAuthCheckTrigger((prev) => !prev);
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, userDetails, triggerAuthCheck }}
        >
            {children}
        </AuthContext.Provider>
    );
};
