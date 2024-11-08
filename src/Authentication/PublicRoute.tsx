// src/PublicRoute.tsx
import React, { useEffect, useState, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ApiService } from '../services/ApiService/ApiService';

interface PublicRouteProps {
  children?: ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectTo = "/Home" }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await ApiService.getInstance().validateAccessToken();
        setIsAuthenticated(prev => prev !== isValid ? isValid : prev);
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Loading state
  }

  return isAuthenticated ? <Navigate to={redirectTo} /> : <>{children}</>;
};

export default PublicRoute;
