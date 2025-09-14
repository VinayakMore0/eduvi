import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { Toaster } from "react-hot-toast";

// Import your state
import { userState } from "./state/atoms";

// Import your components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Import your pages
import HomePage from "./components/pages/HomePage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import CoursesPage from "./components/pages/CoursesPage";
import CourseDetailPage from "./components/pages/CourseDetailPage";
import InstructorsPage from "./components/pages/InstructorsPage";
import AboutPage from "./components/pages/AboutPage";
import ContactPage from "./components/pages/ContactPage";
import CartPage from "./components/pages/CartPage";
import DashboardPage from "./components/pages/DashboardPage";
import CoursePlayerPage from "./components/pages/CoursePlayerPage";
import InstructorDetailPage from "./components/pages/InstructorDetailPage";
import InstructorDashboardPage from "./components/pages/InstructorDashboardPage";
import CreateCoursePage from "./components/pages/CreateCoursePage";
import InstructorGuidePage from "./components/pages/InstructorGuidePage";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a separate component for the app logic that uses Recoil
const AppContent = () => {
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    // Check for stored authentication
    const token = localStorage.getItem("eduvi_token");
    const userData = localStorage.getItem("eduvi_user");

    if (token && userData) {
      try {
        setUser({
          isAuthenticated: true,
          user: JSON.parse(userData),
          token: token,
        });
      } catch (error) {
        // If userData is corrupted, clear it
        localStorage.removeItem("eduvi_token");
        localStorage.removeItem("eduvi_user");
        console.error("Error parsing stored user data:", error);
      }
    }
  }, [setUser]);

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/course/:id" element={<CourseDetailPage />} />
            <Route path="/instructors" element={<InstructorsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/course/:courseId/learn"
              element={<CoursePlayerPage />}
            />
            <Route path="/instructor/:id" element={<InstructorDetailPage />} />
            <Route path="/instructor-guide" element={<InstructorGuidePage />} />
            <Route
              path="/instructor/dashboard"
              element={
                <ProtectedRoute requireRole="instructor">
                  <InstructorDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/create-course"
              element={
                <ProtectedRoute requireRole="instructor">
                  <CreateCoursePage />
                </ProtectedRoute>
              }
            />
            {/* Add a catch-all route for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

// Simple 404 component
const NotFoundPage = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <RecoilRoot>
      <AppContent />
    </RecoilRoot>
  );
};

export default App;
