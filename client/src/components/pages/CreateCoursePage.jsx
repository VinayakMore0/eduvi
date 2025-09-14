import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Save,
  BookOpen,
  Video,
  FileText,
  DollarSign,
} from "lucide-react";
import { userState } from "../../state/atoms";

const CreateCoursePage = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    category: "",
    level: "beginner",
    price: 0,
    originalPrice: 0,
    language: "English",
    thumbnail: null,
    whatYouWillLearn: [""],
    requirements: [""],
    curriculum: [
      {
        section: "Introduction",
        lessons: [{ title: "", duration: "", description: "" }],
      },
    ],
    tags: "",
  });

  React.useEffect(() => {
    if (!user.isAuthenticated || user.user?.role !== "instructor") {
      navigate("/instructors");
      return;
    }
  }, [user, navigate]);

  const handleInputChange = (field, value) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addSection = () => {
    setCourseData((prev) => ({
      ...prev,
      curriculum: [
        ...prev.curriculum,
        {
          section: "",
          lessons: [{ title: "", duration: "", description: "" }],
        },
      ],
    }));
  };

  const addLesson = (sectionIndex) => {
    setCourseData((prev) => ({
      ...prev,
      curriculum: prev.curriculum.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              lessons: [
                ...section.lessons,
                { title: "", duration: "", description: "" },
              ],
            }
          : section
      ),
    }));
  };

  const handleSectionChange = (sectionIndex, field, value) => {
    setCourseData((prev) => ({
      ...prev,
      curriculum: prev.curriculum.map((section, index) =>
        index === sectionIndex ? { ...section, [field]: value } : section
      ),
    }));
  };

  const handleLessonChange = (sectionIndex, lessonIndex, field, value) => {
    setCourseData((prev) => ({
      ...prev,
      curriculum: prev.curriculum.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              lessons: section.lessons.map((lesson, lIndex) =>
                lIndex === lessonIndex ? { ...lesson, [field]: value } : lesson
              ),
            }
          : section
      ),
    }));
  };

  const handleSubmit = async (isDraft = true) => {
    try {
      setLoading(true);

      // Basic validation
      if (!courseData.title || !courseData.description) {
        toast.error("Please fill in required fields");
        return;
      }

      // Mock course creation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        isDraft ? "Course saved as draft!" : "Course published successfully!"
      );
      navigate("/instructor/dashboard");
    } catch (error) {
      toast.error("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: "Basic Info", icon: BookOpen },
    { id: 2, name: "Curriculum", icon: Video },
    { id: 3, name: "Content", icon: FileText },
    { id: 4, name: "Pricing", icon: DollarSign },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/instructor/dashboard")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Course
            </h1>
            <p className="text-gray-600">
              Share your knowledge with students worldwide
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-lg shadow-sm">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <step.icon size={20} />
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-1 mx-4 ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Basic Course Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Complete Web Development Bootcamp"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  value={courseData.shortDescription}
                  onChange={(e) =>
                    handleInputChange("shortDescription", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description for course cards"
                  maxLength={300}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description *
                </label>
                <textarea
                  value={courseData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed description of your course..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={courseData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="web-development">Web Development</option>
                    <option value="data-science">Data Science</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="business">Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    value={courseData.level}
                    onChange={(e) => handleInputChange("level", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Thumbnail
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 mb-2">Upload course thumbnail</p>
                  <p className="text-sm text-gray-500">
                    Recommended size: 1920x1080px
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
                  >
                    Choose File
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Curriculum Step */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Course Curriculum
              </h2>

              {courseData.curriculum.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <input
                      type="text"
                      value={section.section}
                      onChange={(e) =>
                        handleSectionChange(
                          sectionIndex,
                          "section",
                          e.target.value
                        )
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Section title"
                    />
                    <button
                      onClick={() => addLesson(sectionIndex)}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lessonIndex}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) =>
                              handleLessonChange(
                                sectionIndex,
                                lessonIndex,
                                "title",
                                e.target.value
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Lesson title"
                          />
                          <input
                            type="text"
                            value={lesson.duration}
                            onChange={(e) =>
                              handleLessonChange(
                                sectionIndex,
                                lessonIndex,
                                "duration",
                                e.target.value
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Duration (e.g., 10:30)"
                          />
                        </div>
                        <textarea
                          value={lesson.description}
                          onChange={(e) =>
                            handleLessonChange(
                              sectionIndex,
                              lessonIndex,
                              "description",
                              e.target.value
                            )
                          }
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Lesson description (optional)"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={addSection}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <Plus className="mx-auto mb-2" size={24} />
                Add New Section
              </button>
            </motion.div>
          )}

          {/* Content Step */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Course Content
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What students will learn
                </label>
                {courseData.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleArrayChange(
                          "whatYouWillLearn",
                          index,
                          e.target.value
                        )
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Learning outcome"
                    />
                    <button
                      onClick={() => removeArrayItem("whatYouWillLearn", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem("whatYouWillLearn")}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + Add learning outcome
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                {courseData.requirements.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleArrayChange("requirements", index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Requirement"
                    />
                    <button
                      onClick={() => removeArrayItem("requirements", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem("requirements")}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + Add requirement
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={courseData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="web development, javascript, react"
                />
              </div>
            </motion.div>
          )}

          {/* Pricing Step */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Pricing</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={courseData.price}
                    onChange={(e) =>
                      handleInputChange(
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Set to 0 for free course
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={courseData.originalPrice}
                    onChange={(e) =>
                      handleInputChange(
                        "originalPrice",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Optional: Show discount from this price
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={() =>
                setCurrentStep((prev) => Math.min(steps.length, prev + 1))
              }
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <Save className="mr-2" size={18} />
                Save as Draft
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Publishing...
                  </span>
                ) : (
                  <>
                    <Upload className="mr-2" size={18} />
                    Publish Course
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
