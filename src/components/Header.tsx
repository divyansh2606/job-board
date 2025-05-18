import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Menu, X, LogOut, User } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">JobHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/jobs" className="text-gray-700 hover:text-blue-600 transition">
              Find Jobs
            </Link>
            
            {isAuthenticated && !isAdmin && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition">
                  Profile
                </Link>
              </>
            )}
            
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                  Dashboard
                </Link>
                <Link to="/admin/post-job" className="text-gray-700 hover:text-blue-600 transition">
                  Post Job
                </Link>
                <Link to="/admin/applications" className="text-gray-700 hover:text-blue-600 transition">
                  Applications
                </Link>
              </>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hello, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-blue-600 hover:text-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-4 pb-4">
            <Link to="/jobs" className="block text-gray-700 hover:text-blue-600 transition py-2" onClick={() => setIsMenuOpen(false)}>
              Find Jobs
            </Link>
            
            {isAuthenticated && !isAdmin && (
              <>
                <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600 transition py-2" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/profile" className="block text-gray-700 hover:text-blue-600 transition py-2" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
              </>
            )}
            
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" className="block text-gray-700 hover:text-blue-600 transition py-2" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/admin/post-job" className="block text-gray-700 hover:text-blue-600 transition py-2" onClick={() => setIsMenuOpen(false)}>
                  Post Job
                </Link>
                <Link to="/admin/applications" className="block text-gray-700 hover:text-blue-600 transition py-2" onClick={() => setIsMenuOpen(false)}>
                  Applications
                </Link>
              </>
            )}
            
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-700" />
                  <span className="text-gray-700">Hello, {user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/login"
                  className="block px-4 py-2 rounded-md text-center text-blue-600 border border-blue-600 hover:bg-blue-50 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 bg-blue-600 rounded-md text-center text-white hover:bg-blue-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
                <div className="border-t border-gray-200 pt-4">
                  <Link
                    to="/admin/login"
                    className="block text-sm text-gray-600 hover:text-blue-600 transition py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Login
                  </Link>
                </div>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;