import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Briefcase, CheckCircle, XCircle, Clock, AlertCircle, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
  };
  status: 'pending' | 'reviewing' | 'rejected' | 'interview' | 'hired';
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/applications');
        setApplications(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load your applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'reviewing':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'interview':
        return <User className="h-5 w-5 text-purple-500" />;
      case 'hired':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-50 text-blue-800';
      case 'rejected':
        return 'bg-red-50 text-red-800';
      case 'interview':
        return 'bg-purple-50 text-purple-800';
      case 'hired':
        return 'bg-green-50 text-green-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'reviewing':
        return 'Under Review';
      case 'rejected':
        return 'Not Selected';
      case 'interview':
        return 'Interview';
      case 'hired':
        return 'Hired';
      default:
        return status;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-blue-100 rounded-full p-3">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{user?.name}</h3>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 rounded-md bg-blue-50 text-blue-700 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Profile
                </Link>
                <Link
                  to="/jobs"
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Find Jobs
                </Link>
              </nav>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">Application Status</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-gray-700">Pending</span>
                  </div>
                  <span className="font-medium">
                    {applications.filter(app => app.status === 'pending').length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-gray-700">Under Review</span>
                  </div>
                  <span className="font-medium">
                    {applications.filter(app => app.status === 'reviewing').length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-purple-500 mr-2" />
                    <span className="text-gray-700">Interview</span>
                  </div>
                  <span className="font-medium">
                    {applications.filter(app => app.status === 'interview').length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Hired</span>
                  </div>
                  <span className="font-medium">
                    {applications.filter(app => app.status === 'hired').length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-gray-700">Rejected</span>
                  </div>
                  <span className="font-medium">
                    {applications.filter(app => app.status === 'rejected').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Applications</h2>
                <Link to="/jobs">
                  <Button variant="primary">Find More Jobs</Button>
                </Link>
              </div>
              
              {error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="primary">
                    Try Again
                  </Button>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
                  <p className="mt-1 text-gray-500">
                    You haven't applied to any jobs yet. Start by browsing available positions.
                  </p>
                  <div className="mt-6">
                    <Link to="/jobs">
                      <Button variant="primary">Browse Jobs</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.map((application) => (
                        <tr key={application._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              <Link to={`/jobs/${application.job._id}`} className="hover:text-blue-600">
                                {application.job.title}
                              </Link>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{application.job.company}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                              <span className="flex items-center">
                                {getStatusIcon(application.status)}
                                <span className="ml-1">{getStatusText(application.status)}</span>
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link to={`/jobs/${application.job._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                              View Job
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Job Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended for You</h2>
              
              <p className="text-gray-600 italic">Based on your profile and application history, we'll show personalized job recommendations here.</p>
              
              <div className="mt-4">
                <Link to="/profile" className="text-blue-600 hover:text-blue-800 font-medium">
                  Complete your profile to get better recommendations →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;