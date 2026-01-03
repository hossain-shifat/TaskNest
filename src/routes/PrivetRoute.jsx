import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../context/Auth/AuthCOntext';

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * Redirects unauthenticated users to login page
 * Preserves intended destination for post-login redirect
 * Shows loading state while checking authentication
 */
const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    // Show loading spinner while checking auth state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-base-content/60">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    // Store current location to redirect back after login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // User is authenticated, render protected content
    return children;
};

export default PrivateRoute;
