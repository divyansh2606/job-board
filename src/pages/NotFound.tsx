import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-4 max-w-md mx-auto">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="mt-8">
          <Link to="/">
            <Button variant="primary" className="inline-flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;