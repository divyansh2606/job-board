import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Clock, DollarSign, Briefcase } from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  type: string;
  createdAt: string;
}

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(job.createdAt), { addSuffix: true });
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <Link to={`/jobs/${job._id}`} className="inline-block">
              <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-1">
                {job.title}
              </h2>
            </Link>
            <p className="text-gray-700 font-medium">{job.company}</p>
          </div>
          
          <div className="mt-2 md:mt-0">
            {job.type && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-800">
                {job.type}
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-y-2 gap-x-4">
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
          
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>Posted {formattedDate}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-600 line-clamp-2">
            {job.description}
          </p>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <Link
            to={`/jobs/${job._id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details
            <svg
              className="ml-2 h-4 w-4"
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
          
          <Link
            to={`/jobs/${job._id}?apply=true`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;