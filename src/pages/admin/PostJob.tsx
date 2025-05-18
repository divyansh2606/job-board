import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { Plus, Minus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

interface JobFormData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: { value: string }[];
  salary: string;
  type: string;
  category: string;
  deadline: string;
}

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

const categories = [
  'Software Development',
  'Marketing & Sales',
  'Design & Creative',
  'Finance & Accounting',
  'Healthcare & Medical',
  'Human Resources',
  'Customer Service',
  'Education & Training',
  'Engineering',
  'Legal',
  'Other'
];

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<JobFormData>({
    defaultValues: {
      company: user?.name || '',
      requirements: [{ value: '' }]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "requirements"
  });
  
  const onSubmit = async (data: JobFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Format requirements array
      const requirements = data.requirements
        .map(req => req.value.trim())
        .filter(req => req !== '');
      
      const jobData = {
        ...data,
        requirements
      };
      
      await axios.post('/api/jobs', jobData);
      
      navigate('/admin/dashboard', { state: { message: 'Job posted successfully!' } });
    } catch (error) {
      setSubmitError('Failed to post job. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
          <p className="text-gray-600">Create a new job listing to attract qualified candidates</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
          {submitError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              <p>{submitError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  className={`w-full px-3 py-2 border ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="e.g. Senior Software Engineer"
                  {...register('title', { required: 'Job title is required' })}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  id="company"
                  type="text"
                  className={`w-full px-3 py-2 border ${
                    errors.company ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  {...register('company', { required: 'Company name is required' })}
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  className={`w-full px-3 py-2 border ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="e.g. New York, NY or Remote"
                  {...register('location', { required: 'Location is required' })}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  className={`w-full px-3 py-2 border ${
                    errors.type ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  {...register('type', { required: 'Job type is required' })}
                >
                  <option value="">Select Job Type</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  className={`w-full px-3 py-2 border ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  {...register('category', { required: 'Category is required' })}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  id="salary"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. $80,000 - $100,000 per year"
                  {...register('salary')}
                />
              </div>
              
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline
                </label>
                <input
                  id="deadline"
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  {...register('deadline')}
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={8}
                  className={`w-full px-3 py-2 border ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Provide a detailed description of the job role, responsibilities, and benefits..."
                  {...register('description', { required: 'Job description is required' })}
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Requirements
                </label>
                
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex space-x-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Requirement ${index + 1}`}
                        {...register(`requirements.${index}.value`)}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 text-red-500 hover:text-red-700 border border-gray-200 rounded-md"
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={() => append({ value: '' })}
                  className="mt-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
              >
                Post Job
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;