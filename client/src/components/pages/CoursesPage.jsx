import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Search, Filter, Clock, Star, Play } from "lucide-react";
import { coursesFilterState } from "../../state/atoms";
import { filteredCoursesSelector } from "../../state/selectors";

const CoursesPage = () => {
  const [filters, setFilters] = useRecoilState(coursesFilterState);
  const filteredCourses = useRecoilValue(filteredCoursesSelector);

  const categories = [
    "All",
    "Web Development",
    "Data Science",
    "Design",
    "Business",
  ];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];
  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "free", label: "Free" },
    { value: "under100", label: "Under $100" },
    { value: "over100", label: "$100+" },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover thousands of courses taught by expert instructors. Learn at
            your own pace and advance your career.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={filters.price}
                onChange={(e) =>
                  setFilters({ ...filters, price: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>

              <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={20} />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="text-white ml-1" size={24} />
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-900">
                  ${course.price}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-sm text-gray-600">
                      {course.rating}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({course.students} students)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={16} />
                    <span>8 weeks</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Load More Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
