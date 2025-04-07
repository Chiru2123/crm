
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'telecaller' | 'any';
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  requiredRole = 'any'
}) => {
  const { isAuthenticated, isAdmin, isTelecaller } = useAuth();
  const location = useLocation();

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/telecaller" replace />;
  }

  if (requiredRole === 'telecaller' && !isTelecaller && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
