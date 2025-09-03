import { Play, Video, Volume2 } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const FeaturesSection = () => {
  const features = [
    {
      icon: Video,
      title: "High quality video, audio & live classes",
      description:
        "High-definition video is video of higher resolution and quality than standard-definition. While there is no standardized meaning for high-definition, generally any video image with considerably more than 480 vertical scan lines or 576 vertical lines is considered high-definition.",
      color: "bg-blue-500",
    },
    {
      icon: Volume2,
      title: "Premium Audio Experience",
      description:
        "Crystal clear audio quality ensures you never miss important details in your learning journey.",
      color: "bg-purple-500",
    },
    {
      icon: Play,
      title: "Interactive Live Sessions",
      description:
        "Join live interactive sessions with instructors and fellow students for real-time learning.",
      color: "bg-green-500",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience learning like never before with our cutting-edge features
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group hover:shadow-xl transition-all duration-300 p-8 rounded-2xl border border-gray-100"
            >
              <div
                className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
