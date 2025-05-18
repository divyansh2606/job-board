import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, BriefcaseIcon, Filter, X } from 'lucide-react';
import Button from '../../components/common/Button';
import JobCard from '../../components/jobs/JobCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
}

const JobSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Form states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [jobType, setJobType] = useState(searchParams.get('type') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  
  // Categories and job types (would typically come from API)
  const categories = [
    'Software Development',
    'Marketing & Sales',
    'Design & Creative',
    'Finance & Accounting',
    'Healthcare & Medical',
    'Human Resources',
    'Customer Service',
    'Education & Training'
  ];
  
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  
  useEffect(() => {
    fetchJobs();
  }, [searchParams]);
  
  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchParams.get('q')) params.append('q', searchParams.get('q')!);
      if (searchParams.get('location')) params.append('location', searchParams.get('location')!);
      if (searchParams.get('category')) params.append('category', searchParams.get('category')!);
      if (searchParams.get('type')) params.append('type', searchParams.get('type')!);
      if (searchParams.get('sort')) params.append('sort', searchParams.get('sort')!);
      
      const response = await axios.get(`/api/jobs?${params.toString()}`);
      setJobs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params: Record<string, string> = {};
    if (searchTerm) params.q = searchTerm;
    if (location) params.location = location;
    if (category) params.category = category;
    if (jobType) params.type = jobType;
    if (sortBy) params.sort = sortBy;
    
    setSearchParams(params);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setCategory('');
    setJobType('');
    setSortBy('newest');
    setSearchParams({});
  };
  
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and career goals</p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    className="w-full pl-10 pr-3 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full pl-10 pr-3 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="lg:col-span-1 md:col-span-2">
                <div className="flex space-x-2">
                  <Button type="submit" variant="primary" className="flex-1">
                    Search Jobs
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={toggleFilter}
                    className="px-3 lg:px-4"
                  >
                    <Filter className="h-5 w-5" />
                    <span className="ml-2 hidden sm:inline">Filters</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Advanced Filters */}
            {filterOpen && (
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Type
                    </label>
                    <select
                      id="jobType"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      {jobTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                      Sort By
                    </label>
                    <select
                      id="sortBy"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                    className="inline-flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
        
        {/* Active Filters */}
        {(searchParams.toString() !== '') && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchParams.get('q') && (
              <div className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-800 flex items-center">
                <span>Keyword: {searchParams.get('q')}</span>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSearchParams(params => {
                      params.delete('q');
                      return params;
                    });
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {searchParams.get('location') && (
              <div className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-800 flex items-center">
                <span>Location: {searchParams.get('location')}</span>
                <button 
                  onClick={() => {
                    setLocation('');
                    setSearchParams(params => {
                      params.delete('location');
                      return params;
                    });
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {searchParams.get('category') && (
              <div className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-800 flex items-center">
                <span>Category: {searchParams.get('category')}</span>
                <button 
                  onClick={() => {
                    setCategory('');
                    setSearchParams(params => {
                      params.delete('category');
                      return params;
                    });
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {searchParams.get('type') && (
              <div className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-800 flex items-center">
                <span>Type: {searchParams.get('type')}</span>
                <button 
                  onClick={() => {
                    setJobType('');
                    setSearchParams(params => {
                      params.delete('type');
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
        
        {/* Job Results */}
        <div className="mb-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchJobs} variant="primary">
                Try Again
              </Button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search filters or browse all available jobs.
              </p>
              <div className="mt-6">
                <Button onClick={clearFilters} variant="primary">
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">{jobs.length} job(s) found</p>
              <div className="grid grid-cols-1 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;