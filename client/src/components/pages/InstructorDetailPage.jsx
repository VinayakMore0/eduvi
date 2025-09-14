import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Star,
  Users,
  BookOpen,
  Award,
  ArrowLeft,
  Linkedin,
  Twitter,
  Github,
  Globe,
  Play,
  Clock,
  TrendingUp,
} from "lucide-react";
import ApiService from "../../services/apiService";

const InstructorDetailPage = () => {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstructorData();
  }, [id]);

  const loadInstructorData = async () => {
    try {
      const response = await ApiService.getInstructor(id);
      setInstructor(response.data.instructor);
      setCourses(response.data.instructor.courses || []);
    } catch (error) {
      console.error("Load instructor error:", error);
      toast.error("Failed to load instructor details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Instructor not found
          </h2>
          <Link to="/instructors" className="text-blue-600 hover:text-blue-700">
            Back to Instructors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/instructors"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft size={20} />
          Back to Instructors
        </Link>

        {/* Instructor Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="text-center lg:text-left">
              <img
                src={
                  instructor.avatar?.url ||
                  `https://ui-avatars.com/api/?name=${instructor.name}&size=200`
                }
                alt={instructor.name}
                className="w-48 h-48 rounded-full object-cover mx-auto lg:mx-0"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {instructor.name}
              </h1>
              <p className="text-xl text-blue-600 font-semibold mb-4">
                {instructor.profile?.title || "Expert Instructor"}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {instructor.stats?.averageRating || "4.8"}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    <Star className="text-yellow-400 fill-current" size={14} />
                    Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {instructor.stats?.totalStudents?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {instructor.stats?.totalCourses || "0"}
                  </div>
                  <div className="text-sm text-gray-600">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {instructor.profile?.experience || "5+ years"}
                  </div>
                  <div className="text-sm text-gray-600">Experience</div>
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {instructor.profile?.bio ||
                  `${instructor.name} is a passionate educator with extensive experience in their field.`}
              </p>

              {/* Skills */}
              {instructor.profile?.skills && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Skills & Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {instructor.profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="flex gap-4">
                {instructor.profile?.socialLinks?.linkedin && (
                  <a
                    href={instructor.profile.socialLinks.linkedin}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin size={24} />
                  </a>
                )}
                {instructor.profile?.socialLinks?.twitter && (
                  <a
                    href={instructor.profile.socialLinks.twitter}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Twitter size={24} />
                  </a>
                )}
                {instructor.profile?.socialLinks?.github && (
                  <a
                    href={instructor.profile.socialLinks.github}
                    className="text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <Github size={24} />
                  </a>
                )}
                {instructor.profile?.socialLinks?.website && (
                  <a
                    href={instructor.profile.socialLinks.website}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Globe size={24} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Courses by {instructor.name} ({courses.length})
          </h2>

          {courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={
                        course.thumbnail ||
                        "https://via.placeholder.com/400x225"
                      }
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="text-gray-900 ml-1" size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                        {course.level?.charAt(0).toUpperCase() +
                          course.level?.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {course.duration}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star
                          className="text-yellow-400 fill-current"
                          size={14}
                        />
                        <span className="text-sm text-gray-600">
                          {course.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({course.studentsEnrolled?.toLocaleString()} students)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-gray-900">
                        ${course.price}
                      </div>
                      <Link
                        to={`/course/${course._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No courses yet
              </h3>
              <p className="text-gray-600">
                This instructor hasn't published any courses yet.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InstructorDetailPage;
