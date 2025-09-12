import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { coursesState } from "../../state/atoms";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApiService from "../../services/apiService";
import CourseCard from "../ui/CourseCard";

const FeaturedCoursesSection = () => {
  const [courses, setCourses] = useRecoilState(coursesState);
  const navigate = useNavigate();

  useEffect(() => {
    if (courses.courses.length === 0) {
      loadFeaturedCourses();
    }
  }, []);

  const loadFeaturedCourses = async () => {
    try {
      const response = await ApiService.getAllCourses();
      setCourses((prev) => ({
        ...prev,
        courses: response.courses,
      }));
    } catch (error) {
      console.error("Failed to load featured courses", error);
    }
  };

  const featuredCourses = courses.courses
    .filter((course) => course.bestseller)
    .slice(0, 3);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most popular courses, carefully selected by our expert
            instructors
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {featuredCourses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate("/courses")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All Courses
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCoursesSection;
