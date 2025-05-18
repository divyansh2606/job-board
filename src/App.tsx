import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Lazy loaded components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'));
const AdminRegister = lazy(() => import('./pages/auth/AdminRegister'));
const JobDetail = lazy(() => import('./pages/jobs/JobDetail'));
const JobSearch = lazy(() => import('./pages/jobs/JobSearch'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const PostJob = lazy(() => import('./pages/admin/PostJob'));
const Applications = lazy(() => import('./pages/admin/Applications'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="h-screen flex items-center justify-center"><LoadingSpinner size="large" /></div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin/register" element={<AdminRegister />} />
            <Route path="jobs">
              <Route index element={<JobSearch />} />
              <Route path=":id" element={<JobDetail />} />
            </Route>
            
            {/* Protected routes for candidates */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            {/* Protected routes for admins */}
            <Route element={<AdminRoute />}>
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/post-job" element={<PostJob />} />
              <Route path="admin/applications" element={<Applications />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;