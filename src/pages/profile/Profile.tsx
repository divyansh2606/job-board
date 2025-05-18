import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, MapPin, Phone, Link as LinkIcon, Briefcase, GraduationCap, Award } from 'lucide-react';
import Button from '../../components/common/Button';

const Profile = () => {
  const { user } = useAuth();
  
  // This would typically come from an API call
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: 'New York, NY',
    phone: '(555) 123-4567',
    website: 'https://myportfolio.com',
    headline: 'Senior Software Engineer',
    summary: 'Experienced software engineer with a passion for building scalable web applications. Proficient in React, Node.js, and cloud technologies.',
    experience: [
      {
        id: 1,
        title: 'Senior Software Engineer',
        company: 'Tech Solutions Inc.',
        location: 'New York, NY',
        startDate: '2020-01',
        endDate: '',
        current: true,
        description: 'Leading development of cloud-based SaaS products. Architecting scalable solutions using React, Node.js, and AWS.'
      },
      {
        id: 2,
        title: 'Software Developer',
        company: 'Digital Innovations',
        location: 'Boston, MA',
        startDate: '2017-06',
        endDate: '2019-12',
        current: false,
        description: 'Developed responsive web applications for clients across various industries. Implemented CI/CD pipelines and test automation.'
      }
    ],
    education: [
      {
        id: 1,
        degree: 'MS in Computer Science',
        school: 'Boston University',
        location: 'Boston, MA',
        startDate: '2015-09',
        endDate: '2017-05',
        description: 'Specialized in Software Engineering and Machine Learning'
      }
    ],
    skills: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 
      'AWS', 'Docker', 'GraphQL', 'RESTful APIs', 'Redux', 'TDD'
    ]
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(date);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
            <p className="text-gray-600">Manage your professional profile</p>
          </div>
          
          <Button
            variant={isEditing ? 'outline' : 'primary'}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="text-center mb-6">
                <div className="inline-block bg-blue-100 rounded-full p-4 mb-4">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-600 mt-1">{profile.headline}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{profile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{profile.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{profile.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <LinkIcon className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {profile.website}
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Summary</h2>
              <p className="text-gray-700">{profile.summary}</p>
            </div>
            
            {/* Experience */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                )}
              </div>
              
              <div className="space-y-6">
                {profile.experience.map((exp) => (
                  <div key={exp.id} className="flex">
                    <div className="mr-4">
                      <div className="bg-blue-100 rounded-full p-2">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{exp.title}</h3>
                      <p className="text-gray-600">{exp.company} • {exp.location}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                      <p className="mt-2 text-gray-700">{exp.description}</p>
                      
                      {isEditing && (
                        <div className="mt-3 flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Delete</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Education */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                )}
              </div>
              
              <div className="space-y-6">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="flex">
                    <div className="mr-4">
                      <div className="bg-blue-100 rounded-full p-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.school} • {edu.location}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                      <p className="mt-2 text-gray-700">{edu.description}</p>
                      
                      {isEditing && (
                        <div className="mt-3 flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Delete</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Certifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Award className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>
                )}
              </div>
              
              <div className="text-center py-8">
                <Award className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No certifications yet</h3>
                <p className="mt-1 text-gray-500">
                  Add your professional certifications to showcase your skills
                </p>
                {isEditing && (
                  <div className="mt-4">
                    <Button variant="primary">Add Your First Certification</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;