import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  BookOpen,
  Users,
  DollarSign,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
} from "lucide-react";
import { userState } from "../../state/atoms";
import ApiService from "../../services/apiService";

const InstructorDashboardPage = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({
    stats: {
      totalCourses: 0,
      totalStudents: 0,
      totalRevenue: 0,
      averageRating: 0,
    },
    courses: [],
    recentEnrollments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.isAuthenticated || user.user?.role !== "instructor") {
      navigate("/instructors");
      return;
    }
    loadDashboard();
  }, [user, navigate]);

  const loadDashboard = async () => {
    try {
      // Mock data since we don't have real backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDashboard({
        stats: {
          totalCourses: 3,
          totalStudents: 1250,
          totalRevenue: 15750,
          averageRating: 4.8,
        },
        courses: [
          {
            _id: "1",
            title: "Complete Web Development Bootcamp",
            studentsEnrolled: 850,
            revenue: 8500,
            rating: 4.9,
            status: "published",
            createdAt: new Date("2024-01-15"),
          },
          {
            _id: "2",
            title: "Advanced React Patterns",
            studentsEnrolled: 400,
            revenue: 7250,
            rating: 4.7,
            status: "published",
            createdAt: new Date("2024-02-20"),
          },
        ],
        recentEnrollments: [
          {
            studentName: "John Doe",
            courseName: "Web Development Bootcamp",
            enrolledAt: new Date(),
          },
          {
            studentName: "Jane Smith",
            courseName: "Advanced React Patterns",
            enrolledAt: new Date(),
          },
        ],
      });
    } catch (error) {
      console.error("Dashboard load error:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        // Mock deletion
        setDashboard((prev) => ({
          ...prev,
          courses: prev.courses.filter((c) => c._id !== courseId),
        }));
        toast.success("Course deleted successfully");
      } catch (error) {
        toast.error("Failed to delete course");
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Instructor Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user.user?.name}!</p>
            </div>
            <Link
              to="/instructor/create-course"
              className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create New Course
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Courses",
              value: dashboard.stats.totalCourses,
              icon: BookOpen,
              color: "blue",
            },
            {
              label: "Total Students",
              value: dashboard.stats.totalStudents.toLocaleString(),
              icon: Users,
              color: "green",
            },
            {
              label: "Total Revenue",
              value: `$${dashboard.stats.totalRevenue.toLocaleString()}`,
              icon: DollarSign,
              color: "purple",
            },
            {
              label: "Average Rating",
              value: dashboard.stats.averageRating,
              icon: Star,
              color: "orange",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className={`text-${stat.color}-600`} size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                <Link
                  to="/instructor/create-course"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Create New Course
                </Link>
              </div>

              <div className="space-y-4">
                {dashboard.courses.map((course) => (
                  <div
                    key={course._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {course.studentsEnrolled} students
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign size={14} />${course.revenue} revenue
                          </span>
                          <span className="flex items-center gap-1">
                            <Star
                              size={14}
                              className="text-yellow-400 fill-current"
                            />
                            {course.rating} rating
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            course.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {course.status}
                        </span>

                        <div className="flex items-center gap-1">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Eye size={16} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteCourse(course._id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {dashboard.courses.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen
                      className="mx-auto text-gray-400 mb-4"
                      size={48}
                    />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No courses yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create your first course to start teaching
                    </p>
                    <Link
                      to="/instructor/create-course"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Course
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            {/* Recent Enrollments */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Enrollments
              </h3>
              <div className="space-y-3">
                {dashboard.recentEnrollments.map((enrollment, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="text-blue-600" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {enrollment.studentName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {enrollment.courseName}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {enrollment.enrolledAt.toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                This Month
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">New Students</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue</span>
                  <span className="font-semibold">$2,350</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Course Views</span>
                  <span className="font-semibold">1,240</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboardPage;
