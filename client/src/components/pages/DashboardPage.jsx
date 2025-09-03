import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userState } from "../../state/atoms";
import { useRecoilValue } from "recoil";

const DashboardPage = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate("/login");
    }
  }, [user.isAuthenticated, navigate]);

  if (!user.isAuthenticated) {
    return null;
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.user?.name}!
          </h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Enrolled Courses</h2>
            <div className="text-3xl font-bold text-blue-600">5</div>
            <p className="text-gray-600">Active courses</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Completed</h2>
            <div className="text-3xl font-bold text-green-600">12</div>
            <p className="text-gray-600">Courses finished</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Certificates</h2>
            <div className="text-3xl font-bold text-purple-600">8</div>
            <p className="text-gray-600">Earned certificates</p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Continue Learning
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100"
                alt="Course"
                className="w-16 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">
                  Complete Web Development Bootcamp
                </h3>
                <p className="text-gray-600 text-sm">
                  Last accessed 2 days ago
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">65% complete</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
