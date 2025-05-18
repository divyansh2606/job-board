import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { User, ChevronLeft, ChevronRight, Filter, X, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: string;
  };
  candidate: {
    _id: string;
    name: string;
    email: string;
  };
  resume: string;
  coverLetter?: string;
  status: 'pending' | 'reviewing' | 'rejected' | 'interview' | 'hired';
  createdAt: string;
}

const Applications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  
  // Filters
  const [filterOpen, setFilterOpen] = useState(false);
  const [jobFilter, setJobFilter] = useState(searchParams.get('job') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [jobs, setJobs] = useState<{_id: string, title: string}[]>([]);
  
  useEffect(() => {
    fetchApplications();
    fetchJobs();
  }, [searchParams]);
  
  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchParams.get('job')) params.append('job', searchParams.get('job')!);
      if (searchParams.get('status')) params.append('status', searchParams.get('status')!);
      
      const response = await axios.get(`/api/applications?${params.toString()}`);
      setApplications(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs?postedBy=' + user?.id);
      setJobs(response.data.map((job: any) => ({ _id: job._id, title: job.title })));
    } catch (err) {
      console.error('Failed to load jobs');
    }
  };
  
  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      setStatusUpdateLoading(true);
      
      await axios.patch(`/api/applications/${id}/status`, { status });
      
      // Update application in the state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app._id === id ? { ...app, status } : app
        )
      );
      
      if (selectedApplication && selectedApplication._id === id) {
        setSelectedApplication({ ...selectedApplication, status });
      }
      
      setStatusUpdateLoading(false);
    } catch (err) {
      setError('Failed to update application status.');
      setStatusUpdateLoading(false);
    }
  };
  
  const handleFilter = () => {
    const params: Record<string, string> = {};
    if (jobFilter) params.job = jobFilter;
    if (statusFilter) params.status = statusFilter;
    
    setSearchParams(params);
    setFilterOpen(false);
  };
  
  const clearFilters = () => {
    setJobFilter('');
    setStatusFilter('');
    setSearchParams({});
    setFilterOpen(false);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'reviewing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Reviewing
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
      case 'interview':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <User className="h-3 w-3 mr-1" />
            Interview
          </span>
        );
      case 'hired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Hired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Applications</h1>
              <p className="text-gray-600">Review and manage candidate applications</p>
            </div>
            
            <div>
              <Button
                variant="outline"
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          {filterOpen && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="jobFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Job
                  </label>
                  <select
                    id="jobFilter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                  >
                    <option value="">All Jobs</option>
                    {jobs.map((job) => (
                      <option key={job._id} value={job._id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="statusFilter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="interview">Interview</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div className="flex items-end space-x-2">
                  <Button
                    variant="primary"
                    onClick={handleFilter}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Active Filters */}
          {(searchParams.toString() !== '') && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchParams.get('job') && (
                <div className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-800 flex items-center">
                  <span>Job: {jobs.find(j => j._id === searchParams.get('job'))?.title || 'Selected Job'}</span>
                  <button 
                    onClick={() => {
                      setJobFilter('');
                      setSearchParams(params => {
                        params.delete('job');
                        return params;
                      });
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {searchParams.get('status') && (
                <div className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-800 flex items-center">
                  <span>Status: {searchParams.get('status')}</span>
                  <button 
                    onClick={() => {
                      setStatusFilter('');
                      setSearchParams(params => {
                        params.delete('status');
                        return params;
                      });
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              <button 
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 flex items-center"
              >
                <X size={14} className="mr-1" />
                Clear All
              </button>
            </div>
          )}
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
        
        {/* Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Applications</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {applications.length} application{applications.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {applications.length === 0 ? (
                <div className="p-6 text-center">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-base font-medium text-gray-900">No applications found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchParams.toString() 
                      ? 'Try adjusting your filters' 
                      : "You haven't received any applications yet"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 max-h-[70vh] overflow-auto">
                  {applications.map((application) => (
                    <div 
                      key={application._id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                        selectedApplication?._id === application._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => setSelectedApplication(application)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {application.candidate.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {application.candidate.email}
                          </p>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Applied for: <span className="font-medium">{application.job.title}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Application Details */}
          <div className="lg:col-span-2">
            {!selectedApplication ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <User className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No application selected</h3>
                <p className="mt-1 text-gray-500">
                  Select an application from the list to view details
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Application from {selectedApplication.candidate.name}
                    </h2>
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                  <p className="text-gray-600 mt-1">
                    Applied for: <span className="font-medium">{selectedApplication.job.title}</span> at <span className="font-medium">{selectedApplication.job.company}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Applied {formatDistanceToNow(new Date(selectedApplication.createdAt), { addSuffix: true })}
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Applicant Info</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{selectedApplication.candidate.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedApplication.candidate.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Resume / CV</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="prose max-w-none prose-sm">
                        <p className="whitespace-pre-line">{selectedApplication.resume}</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedApplication.coverLetter && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Cover Letter</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="prose max-w-none prose-sm">
                          <p className="whitespace-pre-line">{selectedApplication.coverLetter}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Update Status</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant={selectedApplication.status === 'pending' ? 'primary' : 'outline'}
                        onClick={() => updateApplicationStatus(selectedApplication._id, 'pending')}
                        isLoading={statusUpdateLoading && selectedApplication.status !== 'pending'}
                        disabled={statusUpdateLoading || selectedApplication.status === 'pending'}
                        className="flex items-center"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Pending
                      </Button>
                      
                      <Button
                        variant={selectedApplication.status === 'reviewing' ? 'primary' : 'outline'}
                        onClick={() => updateApplicationStatus(selectedApplication._id, 'reviewing')}
                        isLoading={statusUpdateLoading && selectedApplication.status !== 'reviewing'}
                        disabled={statusUpdateLoading || selectedApplication.status === 'reviewing'}
                        className="flex items-center"
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Reviewing
                      </Button>
                      
                      <Button
                        variant={selectedApplication.status === 'interview' ? 'primary' : 'outline'}
                        onClick={() => updateApplicationStatus(selectedApplication._id, 'interview')}
                        isLoading={statusUpdateLoading && selectedApplication.status !== 'interview'}
                        disabled={statusUpdateLoading || selectedApplication.status === 'interview'}
                        className="flex items-center"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Interview
                      </Button>
                      
                      <Button
                        variant={selectedApplication.status === 'hired' ? 'primary' : 'outline'}
                        onClick={() => updateApplicationStatus(selectedApplication._id, 'hired')}
                        isLoading={statusUpdateLoading && selectedApplication.status !== 'hired'}
                        disabled={statusUpdateLoading || selectedApplication.status === 'hired'}
                        className="flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Hired
                      </Button>
                      
                      <Button
                        variant={selectedApplication.status === 'rejected' ? 'danger' : 'outline'}
                        onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
                        isLoading={statusUpdateLoading && selectedApplication.status !== 'rejected'}
                        disabled={statusUpdateLoading || selectedApplication.status === 'rejected'}
                        className="flex items-center"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 flex justify-between">
                  <Link
                    to={`/jobs/${selectedApplication.job._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    View Job
                  </Link>
                  
                  <button 
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;