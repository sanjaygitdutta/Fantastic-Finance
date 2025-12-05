import { useState, useEffect } from 'react';
import { upstoxAPI } from '../services/upstoxAPI';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function useUpstoxAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if already authenticated
        setIsAuthenticated(upstoxAPI.isAuthenticated());
        setIsLoading(false);

        // Handle OAuth callback
        const code = searchParams.get('code');
        if (code) {
            handleAuthCallback(code);
        }
    }, [searchParams]);

    const handleAuthCallback = async (code: string) => {
        setIsLoading(true);
        try {
            await upstoxAPI.getAccessToken(code);
            setIsAuthenticated(true);
            // Remove code from URL
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Authentication failed:', error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const login = () => {
        window.location.href = upstoxAPI.getAuthorizationUrl();
    };

    const logout = () => {
        upstoxAPI.clearAccessToken();
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        isLoading,
        login,
        logout
    };
}
