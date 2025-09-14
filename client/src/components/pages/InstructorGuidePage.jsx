import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Award,
  MessageCircle,
} from "lucide-react";

const InstructorGuidePage = () => {
  const benefits = [
    {
      icon: Users,
      title: "Reach Global Audience",
      description:
        "Teach students from around the world and build your international presence.",
      color: "blue",
    },
    {
      icon: DollarSign,
      title: "Earn Passive Income",
      description: "Generate revenue from your courses 24/7 while you sleep.",
      color: "green",
    },
    {
      icon: TrendingUp,
      title: "Build Your Brand",
      description:
        "Establish yourself as an expert in your field and grow your professional network.",
      color: "purple",
    },
    {
      icon: Award,
      title: "Make an Impact",
      description: "Share your knowledge and help others achieve their goals.",
      color: "orange",
    },
  ];

  // Tailwind safe color mapping
  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
    orange: { bg: "bg-orange-100", text: "text-orange-600" },
  };

  const steps = [
    {
      step: "01",
      title: "Apply to Teach",
      description:
        "Submit your instructor application with your expertise and experience.",
      icon: BookOpen,
    },
    {
      step: "02",
      title: "Create Your Course",
      description:
        "Use our intuitive course builder to create engaging content.",
      icon: Play,
    },
    {
      step: "03",
      title: "Launch & Earn",
      description: "Publish your course and start earning from day one.",
      icon: DollarSign,
    },
  ];

  const requirements = [
    "Expertise in your subject area",
    "Passion for teaching and helping others",
    "Ability to create engaging content",
    "Basic video recording equipment",
    "Reliable internet connection",
    "Commitment to student success",
  ];

  const faqs = [
    {
      question: "How much can I earn as an instructor?",
      answer:
        "Instructors keep 70% of the revenue from their courses. Top instructors earn thousands of dollars per month.",
    },
    {
      question: "Do I need teaching experience?",
      answer:
        "While teaching experience is helpful, it's not required. We value subject matter expertise and passion for sharing knowledge.",
    },
    {
      question: "What equipment do I need?",
      answer:
        "Basic recording equipment like a decent microphone and camera. Many instructors start with just their smartphone and laptop.",
    },
    {
      question: "How long does the application process take?",
      answer:
        "We typically review applications within 48-72 hours and will notify you of our decision via email.",
    },
    {
      question: "Can I teach multiple subjects?",
      answer:
        "Absolutely! You can create courses on any subject you're qualified to teach.",
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl font-bold mb-6">Become an Instructor</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Share your expertise with thousands of eager learners worldwide.
              Build your brand, earn income, and make a lasting impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/instructors"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                Start Teaching Today
                <ArrowRight size={20} />
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Watch Demo Video
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Teach on Eduvi?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of instructors who are already building successful
              teaching businesses
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const color = colorClasses[benefit.color];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div
                    className={`w-16 h-16 ${color.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <benefit.icon className={`${color.text}`} size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start teaching in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="text-white" size={32} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Instructor Requirements
            </h2>
            <p className="text-lg text-gray-600">
              What we look for in our instructors
            </p>
          </motion.div>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-4">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle
                    className="text-green-500 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-700">{requirement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Real instructors, real results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              // sample stories
              {
                name: "Sarah Johnson",
                title: "Web Development Instructor",
                avatar:
                  "https://images.unsplash.com/photo-1494790108755-2616b612b494?w=150",
                quote:
                  "Teaching on Eduvi has allowed me to reach over 15,000 students and build a sustainable income stream.",
                stats: { students: "15K+", courses: 8, rating: 4.9 },
              },
              {
                name: "Michael Chen",
                title: "Data Science Expert",
                avatar:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                quote:
                  "I love helping students break into data science. The platform makes it easy to create and sell courses.",
                stats: { students: "12K+", courses: 6, rating: 4.8 },
              },
              {
                name: "Emily Rodriguez",
                title: "Design Mentor",
                avatar:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
                quote:
                  "The support from Eduvi team has been incredible. They truly care about instructor success.",
                stats: { students: "9K+", courses: 5, rating: 4.9 },
              },
            ].map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {story.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{story.title}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"{story.quote}"</p>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">
                    {story.stats.students} students
                  </span>
                  <span className="text-green-600">
                    {story.stats.courses} courses
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="text-yellow-400 fill-current" size={14} />
                    {story.stats.rating}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Teaching?
            </h2>
            <p className="text-xl mb-8">
              Join our community of successful instructors and start building
              your teaching business today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/instructors"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                Apply to Teach
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default InstructorGuidePage;
