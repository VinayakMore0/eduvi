import React from "react";
import { useRecoilValue } from "recoil";
import { creatorsDataState } from "../../state/atoms";
import { Github, Linkedin, Star, Twitter } from "lucide-react";

const CreatorsPage = () => {
  const creators = useRecoilValue(creatorsDataState);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Expert Instructors
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from industry professionals and academic experts who are
            passionate about sharing their knowledge.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
            <div className="text-gray-600">Expert Instructors</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
            <div className="text-gray-600">Students Taught</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">4.8</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
            <div className="text-gray-600">Courses Created</div>
          </div>
        </div>

        {/* Instructors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {creators.map((creator) => (
            <div
              key={creator._id}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-6">
                <div className="text-6xl">{creator.avatar}</div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {creator.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-3">
                    {creator.title}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {creator.rating}
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
                        {creator.students.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {creator.courses}
                      </div>
                      <div className="text-sm text-gray-600">Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {creator.experience}
                      </div>
                      <div className="text-sm text-gray-600">Experience</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {creator.bio}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {creator.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Linkedin size={20} />
                      </button>
                      <button className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Twitter size={20} />
                      </button>
                      <button className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Github size={20} />
                      </button>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
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
        </div>
      </div>
    </div>
  );
};

export default CreatorsPage;
