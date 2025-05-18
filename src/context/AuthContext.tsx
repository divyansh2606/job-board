import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, role: 'candidate' | 'admin') => Promise<void>;
  register: (name: string, email: string, password: string, role: 'candidate' | 'admin') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for token and set auth state
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<User & { exp: number }>(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
        } else {
          setUser({
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role
          });
          setIsAuthenticated(true);
          setIsAdmin(decoded.role === 'admin');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'candidate' | 'admin') => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = role === 'admin' ? '/api/auth/admin/login' : '/api/auth/login';
      const response = await axios.post(endpoint, { email, password });
      
      localStorage.setItem('token', response.data.token);
      
      const decoded = jwtDecode<User>(response.data.token);
      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      });
      
      setIsAuthenticated(true);
      setIsAdmin(decoded.role === 'admin');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Authentication failed');
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'candidate' | 'admin') => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = role === 'admin' ? '/api/auth/admin/register' : '/api/auth/register';
      const response = await axios.post(endpoint, { name, email, password });
      
      localStorage.setItem('token', response.data.token);
      
      const decoded = jwtDecode<User>(response.data.token);
      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      });
      
      setIsAuthenticated(true);
      setIsAdmin(decoded.role === 'admin');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Registration failed');
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin
      }}
    >
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