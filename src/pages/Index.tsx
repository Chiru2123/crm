
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

const Index = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to the appropriate page
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/dashboard' : '/telecaller');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/20 to-muted/50 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;
