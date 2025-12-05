import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

interface AdminProtectedRouteProps {
    children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
    const { isAdminAuthenticated } = useAdminAuth();

    if (!isAdminAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
}
