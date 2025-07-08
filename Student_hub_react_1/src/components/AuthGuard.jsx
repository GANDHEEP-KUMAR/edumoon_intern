import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('session_token') != null;
  
  // Routes that don't require authentication (matching backend middleware)
  const publicRoutes = ['/login', '/sign-up', '/', '/auth'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    // If user is not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    // If user is authenticated and trying to access auth pages, redirect to home
    if (isAuthenticated && isPublicRoute && location.pathname !== '/') {
      window.location.href = '/home';
      return;
    }
  }, [isAuthenticated, isPublicRoute, location.pathname]);

  // Show children only if:
  // 1. Route is public, OR
  // 2. User is authenticated
  if (isPublicRoute || isAuthenticated) {
    return children;
  }

  // Show loading or redirect message for protected routes when not authenticated
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ color: '#6c757d' }}>Redirecting to login...</p>
      </div>
    </div>
  );
};

export default AuthGuard;