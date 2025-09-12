import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ApiService from "../../services/apiService";
import { CheckCircle, Github, Linkedin, Star, Twitter } from "lucide-react";

const InstructorsPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    try {
      const response = await ApiService.getInstructors();
      const result = response.data ? response.data : response;
      setInstructors(result.instructors || []);
    } catch (error) {
      toast.error("Failed to load instructors");
      console.error("Error fetching instructors:", error);
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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from industry professionals and academic experts who are
            passionate about sharing their knowledge.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Expert Instructors", value: "150+", color: "blue" },
            { label: "Students Taught", value: "50K+", color: "green" },
            { label: "Average Rating", value: "4.8", color: "purple" },
            { label: "Courses Created", value: "500+", color: "orange" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 text-center shadow-sm"
            >
              <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>
                {stat.value}
              </div>
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
                <div className="flex-shrink-0">
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  {instructor.verified && (
                    <div className="flex items-center justify-center mt-2">
                      <CheckCircle className="text-blue-600" size={16} />
                      <span className="text-sm text-blue-600 ml-1">
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {instructor.name}
                      </h3>
                      <p className="text-blue-600 font-semibold mb-3">
                        {instructor.title}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={instructor.social.linkedin}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Linkedin size={20} />
                      </a>
                      <a
                        href={instructor.social.twitter}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Twitter size={20} />
                      </a>
                      <a
                        href={instructor.social.github}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <Github size={20} />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {instructor.rating}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                        <Star
                          className="text-yellow-400 fill-current"
                          size={14}
                        />
                        Rating
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {instructor.students.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {instructor.courses}
                      </div>
                      <div className="text-sm text-gray-600">Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {instructor.experience}
                      </div>
                      <div className="text-sm text-gray-600">Experience</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {instructor.bio}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {instructor.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Joined{" "}
                      {new Date(instructor.joinDate).toLocaleDateString()}
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      View Courses
                    </button>
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
          <h2 className="text-3xl font-bold mb-4">Become an Instructor</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Share your expertise with thousands of students worldwide. Join our
            community of educators and make an impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Apply to Teach
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InstructorsPage;
