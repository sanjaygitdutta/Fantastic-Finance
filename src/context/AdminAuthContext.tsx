import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
    isAdminAuthenticated: boolean;
    adminLogin: (username: string, password: string) => boolean;
    adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    // Check if admin is already logged in on mount
    useEffect(() => {
        const adminSession = localStorage.getItem('ff_admin_session');
        if (adminSession) {
            const session = JSON.parse(adminSession);
            // Check if session is still valid (24 hours)
            if (Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
                setIsAdminAuthenticated(true);
            } else {
                localStorage.removeItem('ff_admin_session');
            }
        }
    }, []);

    const adminLogin = (username: string, password: string): boolean => {
        // Case-insensitive username check, strict password check
        if (username.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() &&
            password === ADMIN_CREDENTIALS.password) {
            setIsAdminAuthenticated(true);
            localStorage.setItem('ff_admin_session', JSON.stringify({
                timestamp: Date.now(),
                user: 'admin'
            }));
            return true;
        }
        return false;
    };

    const adminLogout = () => {
        setIsAdminAuthenticated(false);
        localStorage.removeItem('ff_admin_session');
    };

    return (
        <AdminAuthContext.Provider value={{ isAdminAuthenticated, adminLogin, adminLogout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
}
