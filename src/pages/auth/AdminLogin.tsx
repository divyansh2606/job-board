import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

type FormData = {
  email: string;
  password: string;
};

const AdminLogin = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await login(data.email, data.password, 'admin');
      navigate('/admin/dashboard');
    } catch (error) {
      setLoginError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/admin/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new admin account
            </Link>
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loginError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              <p>{loginError}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Please enter a valid email address'
                    } 
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    } 
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
              >
                Sign in as Admin
              </Button>
            </div>
          </form>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Looking for a job?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Go to candidate login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;