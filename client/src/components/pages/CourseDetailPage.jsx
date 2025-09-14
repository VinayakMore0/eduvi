import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Play,
  Star,
  User,
  Clock,
  CheckCircle,
  BookOpen,
  Heart,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { cartState, userState, wishlistState } from "../../state/atoms";
import ApiService from "../../services/apiService";

// Course Detail Page
const CourseDetailPage = () => {
  const { id } = useParams(); // Use useParams instead of useLocation
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [cart, setCart] = useRecoilState(cartState);
  const [wishlist, setWishlist] = useRecoilState(wishlistState);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadCourseDetail();
    }
  }, [id]);

  const loadCourseDetail = async () => {
    try {
      setLoading(true);
      // Convert id to number
      const courseDetail = await ApiService.getCourse(id);
      setCourse(courseDetail);
    } catch (error) {
      toast.error("Failed to load course details");
      console.error("Error loading course:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!user.isAuthenticated) {
      toast.error("Please login to purchase courses");
      navigate("/login");
      return;
    }

    const isAlreadyInCart = cart.items?.some((item) => item._id === course._id);
    if (isAlreadyInCart) {
      toast.error("Course already in cart");
      return;
    }

    setCart((prev) => ({
      ...prev,
      items: [...(prev.items || []), course],
      total: (prev.total || 0) + course.price,
    }));
    toast.success("Course added to cart!");
  };

  const toggleWishlist = () => {
    if (!user.isAuthenticated) {
      toast.error("Please login to save courses");
      navigate("/login");
      return;
    }

    const isInWishlist = wishlist.includes(course._id);
    if (isInWishlist) {
      setWishlist((prev) => prev.filter((id) => id !== course._id));
      toast.success("Removed from wishlist");
    } else {
      setWishlist((prev) => [...prev, course._id]);
      toast.success("Added to wishlist!");
    }
  };

  const buyNow = () => {
    addToCart();
    if (user.isAuthenticated) {
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const discount = Math.round((1 - course.price / course.originalPrice) * 100);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            to="/courses"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Courses
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 truncate">{course.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-white transition-colors flex items-center gap-2">
                    <Play size={20} />
                    Preview Course
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  {course.bestseller && (
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Bestseller
                    </span>
                  )}
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {course.level
                      ? course.level.charAt(0).toUpperCase() +
                        course.level.slice(1)
                      : "Level"}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {course.category
                      ? course.category
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())
                      : "Category"}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {course.title}
                </h1>

                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {course.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      {course.instructor}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="font-semibold">{course.rating}</span>
                    <span className="text-gray-500">
                      (
                      {(typeof course.students === "number"
                        ? course.students
                        : 0
                      ).toLocaleString()}{" "}
                      students )
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" />
                    <span className="text-gray-700">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-gray-500" />
                    <span className="text-gray-700">
                      {course.lessons} lessons
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex space-x-8">
                    {["overview", "curriculum", "instructor", "reviews"].map(
                      (tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      )
                    )}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="min-h-96">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          What you'll learn
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {[
                            "Build modern web applications",
                            "Master React and advanced concepts",
                            "Learn backend development",
                            "Deploy applications to cloud",
                            "Work with databases",
                            "Implement authentication",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <CheckCircle
                                className="text-green-500 flex-shrink-0"
                                size={16}
                              />
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          Requirements
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Basic computer knowledge</li>
                          <li>• No prior programming experience required</li>
                          <li>
                            • Access to a computer with internet connection
                          </li>
                          <li>• Willingness to learn and practice</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          Course Description
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          This comprehensive course will take you from beginner
                          to advanced level in web development. You'll learn by
                          building real-world projects and get hands-on
                          experience with the latest technologies and industry
                          best practices. By the end of this course, you'll have
                          the skills to build and deploy modern web
                          applications.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "curriculum" && (
                    <div>
                      <h3 className="text-xl font-semibold mb-6">
                        Course Curriculum
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            section: "Introduction to Web Development",
                            lessons: 12,
                            duration: "2 hours",
                          },
                          {
                            section: "HTML & CSS Fundamentals",
                            lessons: 24,
                            duration: "4 hours",
                          },
                          {
                            section: "JavaScript Essentials",
                            lessons: 36,
                            duration: "6 hours",
                          },
                          {
                            section: "React Development",
                            lessons: 48,
                            duration: "8 hours",
                          },
                          {
                            section: "Backend with Node.js",
                            lessons: 36,
                            duration: "6 hours",
                          },
                        ].map((section, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900">
                                {section.section}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {section.lessons} lessons • {section.duration}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "instructor" && (
                    <div>
                      <h3 className="text-xl font-semibold mb-6">
                        About the Instructor
                      </h3>
                      <div className="flex items-start gap-6">
                        <img
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b494?w=150"
                          alt={course.instructor}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">
                            {course.instructor}
                          </h4>
                          <p className="text-blue-600 mb-4 font-medium">
                            Full Stack Development Expert
                          </p>
                          <p className="text-gray-700 leading-relaxed">
                            {course.instructor} is a passionate educator with
                            over 8 years of experience in web development and
                            software engineering. She has worked at top tech
                            companies and now dedicates her time to teaching the
                            next generation of developers through comprehensive,
                            hands-on courses.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div>
                      <h3 className="text-xl font-semibold mb-6">
                        Student Reviews
                      </h3>
                      <div className="space-y-6">
                        {[
                          {
                            name: "John Doe",
                            rating: 5,
                            comment:
                              "Excellent course! Very comprehensive and well-structured.",
                            date: "2 days ago",
                          },
                          {
                            name: "Jane Smith",
                            rating: 4,
                            comment:
                              "Great content, could use more practical exercises.",
                            date: "1 week ago",
                          },
                          {
                            name: "Mike Johnson",
                            rating: 5,
                            comment:
                              "Best web development course I've taken. Highly recommended!",
                            date: "2 weeks ago",
                          },
                        ].map((review, index) => (
                          <div
                            key={index}
                            className="border-b border-gray-200 pb-6 last:border-b-0"
                          >
                            <div className="flex items-center gap-4 mb-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="text-blue-600" size={20} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {review.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`${
                                          i < review.rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                        size={14}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {review.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-6 flex items-center justify-center relative">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <Play className="text-white ml-1" size={24} />
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-sm font-semibold">
                  Preview
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">
                      ${course.price}
                    </span>
                    <span className="text-lg text-gray-400 line-through ml-2">
                      ${course.originalPrice}
                    </span>
                  </div>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {discount}% OFF
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={addToCart}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={toggleWishlist}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Heart
                      className={`${
                        wishlist.includes(course._id)
                          ? "text-red-500 fill-current"
                          : "text-gray-600"
                      }`}
                      size={20}
                    />
                  </button>
                </div>

                <button
                  onClick={buyNow}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Buy Now
                </button>

                <div className="text-center text-sm text-gray-500">
                  30-Day Money-Back Guarantee
                </div>

                {/* Course Info */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Students enrolled</span>
                    <span className="font-semibold">
                      {(typeof course.students === "number"
                        ? course.students
                        : 0
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total duration</span>
                    <span className="font-semibold">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Lessons</span>
                    <span className="font-semibold">{course.lessons}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Certificate</span>
                    <span className="font-semibold text-green-600">Yes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Access</span>
                    <span className="font-semibold">Lifetime</span>
                  </div>
                </div>

                {/* Share */}
                <div className="pt-4 border-t">
                  <button className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Share2 size={16} />
                    Share this course
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
