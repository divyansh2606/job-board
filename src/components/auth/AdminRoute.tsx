import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminRoute = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminRoute;