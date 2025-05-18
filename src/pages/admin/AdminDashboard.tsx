import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Briefcase, Users, LineChart, ChevronRight, Plus, Edit, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  createdAt: string;
  applications?: number;
}

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
  };
  candidate: {
    name: string;
    email: string;
  };
  status: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get jobs posted by this admin
        const jobsResponse = await axios.get('/api/jobs?postedBy=' + user?.id);
        
        // Get applications for these jobs
        const applicationsResponse = await axios.get('/api/applications');
        
        // Process and set jobs with application counts
        const jobsWithApplications = jobsResponse.data.map((job: Job) => ({
          ...job,
          applications: applicationsResponse.data.filter((app: any) => app.job._id === job._id).length
        }));
        
        setJobs(jobsWithApplications);
        
        // Get recent 5 applications
        setRecentApplications(applicationsResponse.data.slice(0, 5));
        
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'reviewing':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Reviewing</span>;
      case 'rejected':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      case 'interview':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Interview</span>;
      case 'hired':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Hired</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  // Calculate stats
  const totalJobs = jobs.length;
  const totalApplications = jobs.reduce((sum, job) => sum + (job.applications || 0), 0);
  const pendingApplications = recentApplications.filter(app => app.status === 'pending').length;
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-8">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-red-700 font-medium underline mt-2"
            >
              Refresh Page
            </button>
          </div>
        )}
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Job Postings</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalJobs}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Applications</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalApplications}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3 mr-4">
                <LineChart className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending Reviews</p>
                <h3 className="text-2xl font-bold text-gray-900">{pendingApplications}</h3>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/post-job"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Post a New Job</h3>
                <p className="text-sm text-gray-500">Create a new job listing</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
            
            <Link
              to="/admin/applications"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="bg-purple-100 rounded-full p-2 mr-3">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Review Applications</h3>
                <p className="text-sm text-gray-500">Manage candidate applications</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
            
            <Link
              to="/jobs"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="bg-teal-100 rounded-full p-2 mr-3">
                <Eye className="h-5 w-5 text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">View Job Listings</h3>
                <p className="text-sm text-gray-500">See your jobs as candidates do</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          </div>
        </div>
        
        {/* Your Jobs */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Job Postings</h2>
            <Link to="/admin/post-job">
              <Button variant="primary">
                <Plus className="h-4 w-4 mr-2" />
                Add New Job
              </Button>
            </Link>
          </div>
          
          {jobs.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs posted yet</h3>
              <p className="mt-1 text-gray-500">
                Start by posting your first job listing
              </p>
              <div className="mt-6">
                <Link to="/admin/post-job">
                  <Button variant="primary">Post a Job</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posted
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applications
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          <Link to={`/jobs/${job._id}`} className="hover:text-blue-600">
                            {job.title}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{job.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{job.applications || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/jobs/${job._id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                          <Eye className="h-4 w-4 inline mr-1" />
                          View
                        </Link>
                        <Link to={`/admin/edit-job/${job._id}`} className="text-green-600 hover:text-green-900 mr-3">
                          <Edit className="h-4 w-4 inline mr-1" />
                          Edit
                        </Link>
                        <Link to={`/admin/applications?job=${job._id}`} className="text-purple-600 hover:text-purple-900">
                          <Users className="h-4 w-4 inline mr-1" />
                          Applications
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
            <Link to="/admin/applications" className="text-blue-600 hover:text-blue-800 font-medium">
              View All
            </Link>
          </div>
          
          {recentApplications.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">No applications received yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
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
                  {recentApplications.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{application.candidate.name}</div>
                        <div className="text-sm text-gray-500">{application.candidate.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          <Link to={`/jobs/${application.job._id}`} className="hover:text-blue-600">
                            {application.job.title}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/admin/applications/${application._id}`} className="text-blue-600 hover:text-blue-900">
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;