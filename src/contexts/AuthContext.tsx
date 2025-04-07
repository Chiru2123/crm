
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types/types';
import { authAPI } from '../services/apiClient';
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTelecaller: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('crm_user');
    
    if (token && storedUser) {
      try {
        // Parse the stored user data
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Optionally fetch fresh user data from the API
        const fetchUserProfile = async () => {
          try {
            const userData = await authAPI.getUserProfile();
            // Convert MongoDB _id to id for frontend consistency
            const user: User = {
              id: userData._id,
              name: userData.name,
              email: userData.email,
              role: userData.role as Role,
              avatar: userData.avatar
            };
            setUser(user);
            localStorage.setItem('crm_user', JSON.stringify(user));
          } catch (error) {
            console.error('Error fetching user profile:', error);
            // If API call fails, still use the stored user data
          }
        };
        
        fetchUserProfile();
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('crm_user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Call the login API endpoint
      const response = await authAPI.login(email, password);
      
      // Extract user data and token from response
      const { token, ...userData } = response;
      
      // Convert MongoDB _id to id for frontend consistency
      const user: User = {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role as Role,
        avatar: userData.avatar
      };
      
      // Set user in state
      setUser(user);
      setIsAuthenticated(true);
      
      // Store token and user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('crm_user', JSON.stringify(user));
      
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('crm_user');
    localStorage.removeItem('token');
    toast.success('You have been logged out successfully.');
  };

  const isAdmin = user?.role === 'admin';
  const isTelecaller = user?.role === 'telecaller';

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser,
      login, 
      logout, 
      isAuthenticated,
      isAdmin,
      isTelecaller
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
