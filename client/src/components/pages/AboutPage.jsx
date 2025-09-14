import React from "react";
import { Globe, Heart, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-20 text-center"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Eduvi</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to democratize education and make high-quality
            learning accessible to everyone, everywhere.
          </p>
        </motion.div>

        {/* Mission Section */}
        <div className="py-16 border-t border-gray-200">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At Eduvi, we believe that education is the key to unlocking
                human potential. Our platform connects learners with world-class
                instructors, providing access to knowledge that was once limited
                to elite institutions.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're breaking down barriers to education by offering
                affordable, flexible, and engaging courses that fit into any
                lifestyle. Whether you're looking to advance your career,
                explore a new passion, or simply learn something new, we're here
                to support your journey.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 flex items-center justify-center aspect-square"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="text-white" size={48} />
                </div>
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-gray-600">Lives Transformed</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Accessibility",
                description:
                  "Quality education should be available to everyone, regardless of background or location.",
                color: "blue",
              },
              {
                icon: TrendingUp,
                title: "Excellence",
                description:
                  "We maintain the highest standards in content quality and learning experience.",
                color: "green",
              },
              {
                icon: Heart,
                title: "Community",
                description:
                  "Learning is better together. We foster connections between learners and instructors.",
                color: "purple",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className={`w-16 h-16 bg-${value.color}-600 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <value.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-gray-600">Numbers that tell our story</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "50,000+", label: "Active Students", color: "blue" },
              { value: "500+", label: "Expert Instructors", color: "green" },
              { value: "1,000+", label: "Courses Available", color: "purple" },
              { value: "95%", label: "Completion Rate", color: "orange" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className={`text-4xl font-bold text-${stat.color}-600 mb-2`}
                >
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16 border-t border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-lg text-gray-600">
              Meet the people behind Eduvi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "CEO & Founder",
                avatar:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
              },
              {
                name: "Sarah Williams",
                role: "CTO",
                avatar:
                  "https://images.unsplash.com/photo-1494790108755-2616b612b494?w=150",
              },
              {
                name: "Michael Brown",
                role: "Head of Education",
                avatar:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
