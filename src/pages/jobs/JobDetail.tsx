import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { MapPin, Calendar, DollarSign, Building, Clock, Briefcase, Share2, BookmarkPlus, ChevronLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary: string;
  type: string;
  category: string;
  createdAt: string;
  deadline?: string;
  postedBy: {
    name: string;
    email: string;
  };
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(searchParams.get('apply') === 'true');
  
  // Application form states
  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/jobs/${id}`);
        setJob(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [id]);
  
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      setSubmitting(true);
      setApplicationError(null);
      
      await axios.post('/api/applications', {
        jobId: id,
        resume,
        coverLetter
      });
      
      setApplicationSuccess(true);
      setShowApplyForm(false);
      
      // Clear form
      setResume('');
      setCoverLetter('');
    } catch (error) {
      setApplicationError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Job not found'}</p>
          <Link to="/jobs">
            <Button variant="primary">
              Back to Job Listings
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const formattedDate = format(new Date(job.createdAt), 'MMMM dd, yyyy');
  const deadlineDate = job.deadline ? format(new Date(job.deadline), 'MMMM dd, yyyy') : null;
  
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/jobs" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Job Listings
          </Link>
        </div>
        
        {applicationSuccess && (
          <div className="mb-8 bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
            <p className="font-medium">Application submitted successfully!</p>
            <p>Your application has been sent to the employer. You can check the status in your dashboard.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-xl text-gray-700 mb-4">{job.company}</p>
                  
                  <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4">
                    {job.location && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{job.location}</span>
                      </div>
                    )}
                    
                    {job.salary && (
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                    
                    {job.type && (
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>{job.type}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Posted on {formattedDate}</span>
                    </div>
                  </div>
                  
                  {job.type && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-800">
                      {job.type}
                    </span>
                  )}
                  
                  {job.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-800 ml-2">
                      {job.category}
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <BookmarkPlus className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line mb-6">{job.description}</p>
              </div>
              
              {job.requirements && job.requirements.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Requirements</h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {job.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            
            {/* Application Form */}
            {showApplyForm && !isAdmin && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply for this Position</h2>
                
                {!isAuthenticated ? (
                  <div className="bg-blue-50 p-4 rounded-md mb-6">
                    <p className="text-blue-700 font-medium mb-2">You need to be logged in to apply for this job.</p>
                    <div className="flex space-x-4">
                      <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                        Login
                      </Link>
                      <span className="text-gray-500">or</span>
                      <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                        Create an account
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-6">
                    {applicationError && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-4">
                        <p>{applicationError}</p>
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                        Resume / CV (LinkedIn URL or text)
                      </label>
                      <textarea
                        id="resume"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={resume}
                        onChange={(e) => setResume(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                        Cover Letter (Optional)
                      </label>
                      <textarea
                        id="coverLetter"
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowApplyForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={submitting}
                      >
                        Submit Application
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Action Box */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              {isAdmin ? (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Manage This Job</h3>
                  <Link to={`/admin/applications?job=${job._id}`}>
                    <Button variant="primary" fullWidth>
                      View Applications
                    </Button>
                  </Link>
                  <Link to={`/admin/edit-job/${job._id}`}>
                    <Button variant="outline" fullWidth>
                      Edit Job Posting
                    </Button>
                  </Link>
                </div>
              ) : applicationSuccess ? (
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 inline-block mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Application Submitted</h3>
                  <p className="text-gray-600 mb-4">Your application has been sent to the employer.</p>
                  <Link to="/dashboard">
                    <Button variant="outline" fullWidth>
                      Go to My Applications
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  {showApplyForm ? (
                    <p className="text-gray-700 mb-4">Complete the form to apply for this position.</p>
                  ) : (
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate('/login');
                        } else {
                          setShowApplyForm(true);
                        }
                      }}
                    >
                      Apply Now
                    </Button>
                  )}
                </>
              )}
            </div>
            
            {/* Job Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="font-medium text-gray-900 mb-4">Job Details</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Job Type</p>
                  <p className="font-medium text-gray-900">{job.type || 'Not specified'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">{job.category || 'Not specified'}</p>
                </div>
                
                {job.salary && (
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium text-gray-900">{job.salary}</p>
                  </div>
                )}
                
                {deadlineDate && (
                  <div>
                    <p className="text-sm text-gray-500">Application Deadline</p>
                    <p className="font-medium text-gray-900">{deadlineDate}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500">Posted</p>
                  <p className="font-medium text-gray-900">{formattedDate}</p>
                </div>
              </div>
            </div>
            
            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">About the Company</h3>
              
              <div className="flex items-center mb-4">
                <div className="bg-gray-100 rounded-full p-2 mr-3">
                  <Building className="h-6 w-6 text-gray-600" />
                </div>
                <p className="font-medium text-gray-900">{job.company}</p>
              </div>
              
              <p className="text-gray-700 mb-4">
                {job.company} is hiring this position. See other jobs from this company.
              </p>
              
              <Link
                to={`/jobs?company=${encodeURIComponent(job.company)}`}
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                View all jobs
                <svg
                  className="ml-1 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;