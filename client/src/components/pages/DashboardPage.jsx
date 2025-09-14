import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  BookOpen,
  Clock,
  Award,
  Download,
  RefreshCw,
  ChevronRight,
  Search,
  Zap,
} from "lucide-react";
import { userState } from "../../state/atoms";
import ApiService from "../../services/apiService";

const DashboardPage = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    enrollments: [],
    payments: [],
    certificates: [],
  });
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    notStartedCourses: 0,
    certificatesEarned: 0,
    totalHoursLearned: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate("/login");
      return;
    }
    loadDashboardData();
  }, [user.isAuthenticated, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getMockDashboardData();
      const { enrollments, payments, certificates } = response.data;

      setDashboardData({ enrollments, payments, certificates });

      const completed = enrollments.filter((e) => e.isCompleted).length;
      const inProgress = enrollments.filter(
        (e) => !e.isCompleted && e.completionPercentage > 0
      ).length;
      const notStarted = enrollments.filter(
        (e) => e.completionPercentage === 0
      ).length;

      const totalHours = enrollments.reduce((sum, e) => {
        const duration = e.course.duration;
        const hours = duration ? parseInt(duration.split(" ")[0]) || 0 : 0;
        return sum + Math.round((hours * e.completionPercentage) / 100);
      }, 0);

      setStats({
        totalCourses: enrollments.length,
        completedCourses: completed,
        inProgressCourses: inProgress,
        notStartedCourses: notStarted,
        certificatesEarned: certificates.length,
        totalHoursLearned: totalHours,
        currentStreak: 7,
      });
    } catch (error) {
      console.error("Dashboard load error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    toast.success("Dashboard refreshed");
  };

  const continueCourse = (courseId) => {
    navigate(`/course/${courseId}/learn`);
  };

  const downloadCertificate = async (certificateId) => {
    try {
      toast.success("Certificate download started");
      // real: await ApiService.downloadCertificate(certificateId);
    } catch {
      toast.error("Failed to download certificate");
    }
  };

  const getFilteredEnrollments = () => {
    let filtered = dashboardData.enrollments;

    if (filter === "completed") {
      filtered = filtered.filter((e) => e.isCompleted);
    } else if (filter === "in-progress") {
      filtered = filtered.filter(
        (e) => !e.isCompleted && e.completionPercentage > 0
      );
    } else if (filter === "not-started") {
      filtered = filtered.filter((e) => e.completionPercentage === 0);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (e) =>
          e.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.course.instructor.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const filteredEnrollments = getFilteredEnrollments();

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {user.user?.name}! 👋
                </h1>
                <p className="text-blue-100">
                  {stats.inProgressCourses > 0
                    ? `You have ${stats.inProgressCourses} course${
                        stats.inProgressCourses > 1 ? "s" : ""
                      } in progress.`
                    : "Ready to continue your learning journey?"}
                </p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Zap size={14} className="text-yellow-300" />{" "}
                    {stats.currentStreak} day streak
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} className="text-blue-200" />{" "}
                    {stats.totalHoursLearned} hours learned
                  </span>
                </div>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 flex items-center gap-2"
                >
                  <RefreshCw
                    className={refreshing ? "animate-spin" : ""}
                    size={16}
                  />{" "}
                  Refresh
                </button>
                <Link
                  to="/courses"
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 flex items-center gap-2"
                >
                  Browse Courses <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* TABS */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", count: null },
              { id: "courses", label: "My Courses", count: stats.totalCourses },
              {
                id: "certificates",
                label: "Certificates",
                count: stats.certificatesEarned,
              },
              {
                id: "payments",
                label: "Payments",
                count: dashboardData.payments.length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === "courses" && (
            <motion.div
              key="courses"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search your courses..."
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All ({stats.totalCourses})</option>
                  <option value="in-progress">
                    In Progress ({stats.inProgressCourses})
                  </option>
                  <option value="completed">
                    Completed ({stats.completedCourses})
                  </option>
                  <option value="not-started">
                    Not Started ({stats.notStartedCourses})
                  </option>
                </select>
              </div>
              {/* Courses Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEnrollments.map((e) => (
                  <motion.div
                    key={e._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow hover:shadow-md overflow-hidden"
                  >
                    <img
                      src={e.course.thumbnail}
                      alt={e.course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">
                        {e.course.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        By {e.course.instructor.name}
                      </p>
                      <div className="flex justify-between mt-2 text-sm">
                        <span>{e.completionPercentage}% complete</span>
                        <button
                          onClick={() => continueCourse(e.course._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {filteredEnrollments.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto text-gray-400" size={40} />
                  <p className="text-gray-600 mt-2">No courses found</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "certificates" && (
            <motion.div
              key="certificates"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.certificates.map((c) => (
                  <div key={c._id} className="bg-white rounded-xl p-6 shadow">
                    <h3 className="font-semibold text-gray-900">
                      {c.course.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Issued {new Date(c.issuedAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => downloadCertificate(c._id)}
                      className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Download size={14} /> Download
                    </button>
                  </div>
                ))}
              </div>
              {dashboardData.certificates.length === 0 && (
                <div className="text-center py-12">
                  <Award className="mx-auto text-gray-400" size={40} />
                  <p className="text-gray-600 mt-2">
                    No certificates earned yet
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "payments" && (
            <motion.div
              key="payments"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Payment History
                </h3>
                {dashboardData.payments.length > 0 ? (
                  <ul className="divide-y">
                    {dashboardData.payments.map((p) => (
                      <li key={p._id} className="py-3">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              Payment ID: {p._id}
                            </p>
                            <ul className="ml-4 list-disc text-gray-700">
                              {p.courses.map((c, idx) => (
                                <li key={idx}>
                                  {c.course?.title || "Unknown Course"}
                                </li>
                              ))}
                            </ul>
                            <p className="text-sm text-gray-500">
                              {new Date(p.createdAt).toLocaleDateString()} ·{" "}
                              {p.paymentMethod} · {p.status}
                            </p>
                          </div>
                          <span className="text-gray-900 font-semibold">
                            ${p.totalAmount}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No payments yet</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardPage;
