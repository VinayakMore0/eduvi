import { ArrowRight, BookOpen, Play, Star, Users } from "lucide-react";
import React from "react";

const HeroSection = () => {
  return (
    <section className="pt-20 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Grow up your skills by
                <span className="text-blue-600"> online courses</span> with
                Eduvi
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Eduvi is a Global training provider based across the India that
                specialises in accredited and bespoke training courses. We crush
                the barriers to getting a degree.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                Get Started <ArrowRight size={20} />
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">250+</div>
                <div className="text-gray-600">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">50K+</div>
                <div className="text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">10+</div>
                <div className="text-gray-600">Years</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-10">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                  <Play className="text-white ml-1" size={32} />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Introduction to Web Development
                </h3>
                <p className="text-gray-600">
                  Learn the fundamentals of web development with our
                  comprehensive course.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-sm text-gray-600">
                      4.9 (2.3k reviews)
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">₹1299</span>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
              <Users className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
