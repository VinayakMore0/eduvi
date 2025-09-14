import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Star, Users, BookOpen, Award, ChevronRight, 
  Linkedin, Twitter, Github, Globe, Plus,
  GraduationCap, TrendingUp, DollarSign
} from 'lucide-react';
import { userState } from '../../state/atoms';
import ApiService from '../../services/apiService';

const InstructorsPage = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBecomeInstructorModal, setShowBecomeInstructorModal] = useState(false);

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    try {
      const response = await ApiService.getInstructors();
      setInstructors(response.instructors);
    } catch (error) {
      console.error('Load instructors error:', error);
      toast.error('Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeInstructor = () => {
    if (!user.isAuthenticated) {
      toast.error('Please login to become an instructor');
      navigate('/login');
      return;
    }

    if (user.user?.role === 'instructor') {
      navigate('/instructor/dashboard');
      return;
    }

    setShowBecomeInstructorModal(true);
  };

  const applyToBeInstructor = async (applicationData) => {
    try {
      await ApiService.applyToBeInstructor(applicationData);
      toast.success('Application submitted! We\'ll review it within 48 hours.');
      setShowBecomeInstructorModal(false);
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Expert Instructors
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Learn from industry professionals and academic experts who are passionate about sharing their knowledge.
          </p>
          <button
            onClick={handleBecomeInstructor}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus size={20} />
            {user.user?.role === 'instructor' ? 'Instructor Dashboard' : 'Become an Instructor'}
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Expert Instructors', value: '150+', icon: Users, color: 'blue' },
            { label: 'Students Taught', value: '50K+', icon: GraduationCap, color: 'green' },
            { label: 'Average Rating', value: '4.8', icon: Star, color: 'purple' },
            { label: 'Courses Created', value: '500+', icon: BookOpen, color: 'orange' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 text-center shadow-sm"
            >
              <div className={`w-16 h-16 bg-${stat.color}-100 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`text-${stat.color}-600`} size={28} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Instructors Grid */}
        <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8 mb-12">
          {instructors.map((instructor, index) => (
            <motion.div
              key={instructor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row items-start gap-8">
                <div className="flex-shrink-0 text-center lg:text-left">
                  <div className="relative">
                    <img 
                      src={instructor.avatar?.url || `https://ui-avatars.com/api/?name=${instructor.name}&size=150`}
                      alt={instructor.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto lg:mx-0"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <Award className="text-white" size={16} />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {instructor.name}
                      </h3>
                      <p className="text-blue-600 font-semibold mb-3">
                        {instructor.profile?.title || 'Expert Instructor'}
                      </p>
                    </div>
                    
                    <div className="flex gap-3 mt-4 lg:mt-0">
                      {instructor.profile?.socialLinks?.linkedin && (
                        <a href={instructor.profile.socialLinks.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Linkedin size={20} />
                        </a>
                      )}
                      {instructor.profile?.socialLinks?.twitter && (
                        <a href={instructor.profile.socialLinks.twitter} className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Twitter size={20} />
                        </a>
                      )}
                      {instructor.profile?.socialLinks?.github && (
                        <a href={instructor.profile.socialLinks.github} className="text-gray-400 hover:text-gray-700 transition-colors">
                          <Github size={20} />
                        </a>
                      )}
                      {instructor.profile?.socialLinks?.website && (
                        <a href={instructor.profile.socialLinks.website} className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Globe size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center lg:text-left">
                      <div className="text-2xl font-bold text-gray-900">{instructor.stats?.averageRating || '4.8'}</div>
                      <div className="text-sm text-gray-600 flex items-center justify-center lg:justify-start gap-1">
                        <Star className="text-yellow-400 fill-current" size={14} />
                        Rating
                      </div>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-2xl font-bold text-gray-900">
                        {instructor.stats?.totalStudents?.toLocaleString() || '0'}
                      </div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-2xl font-bold text-gray-900">
                        {instructor.stats?.totalCourses || '0'}
                      </div>
                      <div className="text-sm text-gray-600">Courses</div>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-2xl font-bold text-gray-900">
                        {instructor.profile?.experience || '5+ years'}
                      </div>
                      <div className="text-sm text-gray-600">Experience</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {instructor.profile?.bio || `${instructor.name} is a passionate educator with extensive experience in their field.`}
                  </p>
                  
                  {instructor.profile?.skills && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {instructor.profile.skills.slice(0, 5).map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Joined {new Date(instructor.createdAt).toLocaleDateString()}
                    </div>
                    <Link
                      to={`/instructor/${instructor._id}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                      View Profile
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Share Your Knowledge?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of expert instructors and inspire thousands of learners worldwide while earning income from your expertise.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Reach Global Audience</h3>
              <p className="text-blue-100 text-sm">Teach students from around the world</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Earn Revenue</h3>
              <p className="text-blue-100 text-sm">Get paid for sharing your knowledge</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Build Your Brand</h3>
              <p className="text-blue-100 text-sm">Establish yourself as an expert</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBecomeInstructor}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {user.user?.role === 'instructor' ? 'Go to Dashboard' : 'Apply to Teach'}
            </button>
            <Link
              to="/instructor-guide"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Become Instructor Modal */}
      <BecomeInstructorModal
        isOpen={showBecomeInstructorModal}
        onClose={() => setShowBecomeInstructorModal(false)}
        onSubmit={applyToBeInstructor}
      />
    </div>
  );
};

// Become Instructor Modal Component
const BecomeInstructorModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    bio: '',
    experience: '',
    education: '',
    skills: '',
    motivation: '',
    sampleWork: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      await onSubmit({
        ...formData,
        skills: skillsArray
      });
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply to Become an Instructor</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your professional background..."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 5 years"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => setFormData({...formData, education: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., MS Computer Science"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills & Expertise (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., React, Node.js, Python, Machine Learning"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to teach?
                  </label>
                  <textarea
                    value={formData.motivation}
                    onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your motivation for teaching..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sample Work/Portfolio (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.sampleWork}
                    onChange={(e) => setFormData({...formData, sampleWork: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://your-portfolio.com"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InstructorsPage;