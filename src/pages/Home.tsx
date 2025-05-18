import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Search, MapPin, Briefcase, TrendingUp, Award, Users, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to search results with the query params
    window.location.href = `/jobs?q=${searchTerm}&location=${location}`;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Find Your Dream Job Today
              </h1>
              <p className="text-xl text-blue-100">
                Connect with top employers and discover opportunities that match your skills and career goals.
              </p>
              
              {/* Search Form */}
              <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-lg space-y-4 md:space-y-0 md:flex md:space-x-2">
                <div className="flex-1">
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
                <div className="flex-1">
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
                <Button type="submit" variant="primary" size="lg">
                  Search Jobs
                </Button>
              </form>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="inline-flex items-center text-white bg-teal-600 hover:bg-teal-700 px-5 py-2.5 rounded-md font-medium transition-colors">
                  <span>Create Account</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link to="/admin/register" className="inline-flex items-center text-white bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-md font-medium transition-colors">
                  <span>Employers: Post a Job</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Job seekers" 
                className="rounded-lg shadow-xl max-h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Job Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Job Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore opportunities in these in-demand industries and find your perfect role
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Briefcase className="h-10 w-10 text-blue-600" />, title: 'Software Development', count: 352 },
              { icon: <TrendingUp className="h-10 w-10 text-teal-600" />, title: 'Marketing & Sales', count: 218 },
              { icon: <Award className="h-10 w-10 text-purple-600" />, title: 'Design & Creative', count: 184 },
              { icon: <Users className="h-10 w-10 text-orange-600" />, title: 'Human Resources', count: 143 },
            ].map((category, index) => (
              <Link key={index} to={`/jobs?category=${category.title}`}>
                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center group">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-blue-600">{category.count} open positions</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/jobs" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              <span>Browse All Categories</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How JobHub Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our streamlined process helps you find and apply to your ideal job in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create an Account',
                description: 'Sign up and build your professional profile to showcase your skills and experience to employers.',
              },
              {
                step: '02',
                title: 'Find Matching Jobs',
                description: 'Search and filter through thousands of opportunities to find the perfect position for your career goals.',
              },
              {
                step: '03',
                title: 'Apply with Ease',
                description: 'Submit your application with just a few clicks and track your application status in real-time.',
              },
            ].map((item, index) => (
              <div key={index} className="relative p-6 bg-gray-50 rounded-lg">
                <div className="absolute -top-4 -left-4 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from professionals who found their dream careers through JobHub
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "I found my dream job at a tech startup within just 2 weeks of using JobHub. The platform's filtering options helped me find exactly what I was looking for.",
                name: "Sarah Johnson",
                title: "Software Engineer",
                image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                quote: "As a hiring manager, JobHub has simplified our recruitment process. We've been able to find qualified candidates quickly and efficiently.",
                name: "Michael Chen",
                title: "HR Director",
                image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                quote: "After relocating to a new city, JobHub helped me connect with local employers and land a position that perfectly matched my skills and experience.",
                name: "Lisa Rodriguez",
                title: "Marketing Manager",
                image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Career Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs on JobHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-block bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-colors">
              Create an Account
            </Link>
            <Link to="/jobs" className="inline-block bg-blue-700 text-white hover:bg-blue-800 px-6 py-3 rounded-md font-medium transition-colors">
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;