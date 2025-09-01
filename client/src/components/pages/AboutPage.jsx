import { BookOpen, Heart, TrendingUp, Users } from "lucide-react";
import React from "react";

const AboutPage = () => {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Eduvi</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to democratize education and make high-quality
            learning accessible to everyone, everywhere.
          </p>
        </div>

        {/* Mission Section */}
        <div className="py-16 border-t border-gray-200">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
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
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 flex items-center justify-center aspect-square">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-white" size={48} />
                </div>
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-gray-600">Lives Transformed</div>
              </div>
            </div>
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
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Accessibility
              </h3>
              <p className="text-gray-600">
                Quality education should be available to everyone, regardless of
                background or location.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Excellence
              </h3>
              <p className="text-gray-600">
                We maintain the highest standards in content quality and
                learning experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Community
              </h3>
              <p className="text-gray-600">
                Learning is better together. We foster connections between
                learners and instructors.
              </p>
            </div>
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
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                50,000+
              </div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Expert Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                1,000+
              </div>
              <div className="text-gray-600">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">Completion Rate</div>
            </div>
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
              { name: "Alex Johnson", role: "CEO & Founder", avatar: "👨‍💼" },
              { name: "Sarah Williams", role: "CTO", avatar: "👩‍💻" },
              {
                name: "Michael Brown",
                role: "Head of Education",
                avatar: "👨‍🎓",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
