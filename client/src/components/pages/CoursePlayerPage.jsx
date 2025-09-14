import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Settings,
  BookOpen,
  CheckCircle,
  Download,
  ArrowLeft,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import { userState } from "../../state/atoms";
import ApiService from "../../services/apiService";

const CoursePlayerPage = () => {
  const { courseId } = useParams();
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate("/login");
      return;
    }
    loadCourseData();
  }, [courseId, user.isAuthenticated, navigate]);

  const loadCourseData = async () => {
    try {
      setLoading(true);

      // Check if user is enrolled
      const enrollmentsResponse = await ApiService.getEnrollments();
      const userEnrollment = enrollmentsResponse.data.enrollments.find(
        (e) => e.course._id === courseId
      );

      if (!userEnrollment) {
        toast.error("You are not enrolled in this course");
        navigate(`/course/${courseId}`);
        return;
      }

      // Get full course details
      const courseResponse = await ApiService.getCourse(courseId);
      const courseData = courseResponse.data.course;

      setCourse(courseData);
      setEnrollment(userEnrollment);

      // Set first lesson as current if no progress
      if (courseData.curriculum && courseData.curriculum.length > 0) {
        const firstSection = courseData.curriculum[0];
        if (firstSection.lessons && firstSection.lessons.length > 0) {
          setCurrentLesson({
            sectionIndex: 0,
            lessonIndex: 0,
            lesson: firstSection.lessons[0],
          });
        }
      }

      // Load user's progress
      const progressResponse = await ApiService.getCourseProgress(courseId);
      setProgress(progressResponse.data.completionPercentage || 0);
    } catch (error) {
      console.error("Load course data error:", error);
      toast.error("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = async (sectionIndex, lessonIndex) => {
    try {
      const section = course.curriculum[sectionIndex];
      const lesson = section.lessons[lessonIndex];

      await ApiService.updateProgress(courseId, {
        sectionId: section._id,
        lessonId: lesson._id,
        completed: true,
        watchTime: lesson.duration || 0,
      });

      // Update local state
      setEnrollment((prev) => ({
        ...prev,
        completionPercentage: Math.min(progress + 100 / getTotalLessons(), 100),
      }));

      toast.success("Lesson marked as complete!");

      // Auto-advance to next lesson
      goToNextLesson();
    } catch (error) {
      toast.error("Failed to update progress");
    }
  };

  const getTotalLessons = () => {
    return (
      course?.curriculum?.reduce(
        (total, section) => total + section.lessons.length,
        0
      ) || 0
    );
  };

  const goToNextLesson = () => {
    if (!currentLesson || !course.curriculum) return;

    const { sectionIndex, lessonIndex } = currentLesson;
    const currentSection = course.curriculum[sectionIndex];

    // Next lesson in current section
    if (lessonIndex + 1 < currentSection.lessons.length) {
      setCurrentLesson({
        sectionIndex,
        lessonIndex: lessonIndex + 1,
        lesson: currentSection.lessons[lessonIndex + 1],
      });
    }
    // Next section
    else if (sectionIndex + 1 < course.curriculum.length) {
      const nextSection = course.curriculum[sectionIndex + 1];
      if (nextSection.lessons.length > 0) {
        setCurrentLesson({
          sectionIndex: sectionIndex + 1,
          lessonIndex: 0,
          lesson: nextSection.lessons[0],
        });
      }
    }
  };

  const goToPreviousLesson = () => {
    if (!currentLesson || !course.curriculum) return;

    const { sectionIndex, lessonIndex } = currentLesson;

    // Previous lesson in current section
    if (lessonIndex > 0) {
      setCurrentLesson({
        sectionIndex,
        lessonIndex: lessonIndex - 1,
        lesson: course.curriculum[sectionIndex].lessons[lessonIndex - 1],
      });
    }
    // Previous section
    else if (sectionIndex > 0) {
      const prevSection = course.curriculum[sectionIndex - 1];
      const lastLessonIndex = prevSection.lessons.length - 1;
      setCurrentLesson({
        sectionIndex: sectionIndex - 1,
        lessonIndex: lastLessonIndex,
        lesson: prevSection.lessons[lastLessonIndex],
      });
    }
  };

  const selectLesson = (sectionIndex, lessonIndex) => {
    const section = course.curriculum[sectionIndex];
    const lesson = section.lessons[lessonIndex];

    setCurrentLesson({
      sectionIndex,
      lessonIndex,
      lesson,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: showSidebar ? 0 : -400 }}
        animate={{ x: showSidebar ? 0 : -400 }}
        className={`w-80 bg-gray-800 border-r border-gray-700 flex flex-col ${
          showSidebar ? "block" : "hidden"
        } lg:block`}
      >
        {/* Course Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-400 hover:text-white flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Dashboard
            </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <h2 className="text-white font-semibold text-lg mb-2">
            {course.title}
          </h2>
          <div className="text-sm text-gray-400 mb-3">
            By {course.instructor.name}
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(enrollment.completionPercentage || 0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${enrollment.completionPercentage || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Course Curriculum */}
        <div className="flex-1 overflow-y-auto">
          {course.curriculum?.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="border-b border-gray-700 last:border-b-0"
            >
              <div className="p-4 bg-gray-750">
                <h3 className="text-white font-medium">{section.section}</h3>
                <div className="text-sm text-gray-400">
                  {section.lessons.length} lessons
                </div>
              </div>

              <div className="space-y-1">
                {section.lessons.map((lesson, lessonIndex) => {
                  const isActive =
                    currentLesson?.sectionIndex === sectionIndex &&
                    currentLesson?.lessonIndex === lessonIndex;
                  const isCompleted = enrollment.progress?.some(
                    (p) => p.lessonId === lesson._id && p.completed
                  );

                  return (
                    <button
                      key={lessonIndex}
                      onClick={() => selectLesson(sectionIndex, lessonIndex)}
                      className={`w-full p-4 text-left hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                        isActive ? "bg-blue-600 text-white" : "text-gray-300"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="text-green-500" size={16} />
                        ) : (
                          <Play
                            className={
                              isActive ? "text-white" : "text-gray-500"
                            }
                            size={16}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {lesson.title}
                        </div>
                        <div className="text-sm opacity-75">
                          {lesson.duration || "5:00"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Video Player Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <Menu size={20} />
              </button>
              <div>
                <h3 className="text-white font-medium">
                  {currentLesson?.lesson.title || "Select a lesson"}
                </h3>
                <div className="text-sm text-gray-400">
                  {currentLesson &&
                    `Section ${currentLesson.sectionIndex + 1}, Lesson ${
                      currentLesson.lessonIndex + 1
                    }`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-white p-2">
                <Settings size={20} />
              </button>
              <button className="text-gray-400 hover:text-white p-2">
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 bg-black flex items-center justify-center">
          {currentLesson ? (
            <div className="w-full max-w-4xl aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
              {/* Placeholder for video player */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="text-white ml-1" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {currentLesson.lesson.title}
                  </h3>
                  <p className="text-gray-400">
                    Duration: {currentLesson.lesson.duration || "5:00"}
                  </p>

                  {/* Video controls */}
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <button
                      onClick={goToPreviousLesson}
                      className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                    >
                      <SkipBack size={20} />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-4 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause size={24} />
                      ) : (
                        <Play className="ml-1" size={24} />
                      )}
                    </button>
                    <button
                      onClick={goToNextLesson}
                      className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                    >
                      <SkipForward size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Video controls overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <Volume2 size={20} />
                    <span className="text-sm">
                      00:00 / {currentLesson.lesson.duration || "05:00"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        markLessonComplete(
                          currentLesson.sectionIndex,
                          currentLesson.lessonIndex
                        )
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm"
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <BookOpen size={48} className="mx-auto mb-4" />
              <p>Select a lesson to start learning</p>
            </div>
          )}
        </div>

        {/* Lesson Content */}
        {currentLesson && (
          <div className="bg-gray-800 border-t border-gray-700 p-6">
            <div className="max-w-4xl mx-auto">
              <h4 className="text-white text-lg font-semibold mb-3">
                About this lesson
              </h4>
              <p className="text-gray-300 leading-relaxed">
                {currentLesson.lesson.description ||
                  `In this lesson, you'll learn about ${currentLesson.lesson.title.toLowerCase()}. 
                  This comprehensive tutorial will guide you through the key concepts and practical applications.`}
              </p>

              {currentLesson.lesson.resources &&
                currentLesson.lesson.resources.length > 0 && (
                  <div className="mt-6">
                    <h5 className="text-white font-medium mb-3">Resources</h5>
                    <div className="space-y-2">
                      {currentLesson.lesson.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource}
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download size={16} />
                          {resource.split("/").pop() || `Resource ${index + 1}`}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePlayerPage;
