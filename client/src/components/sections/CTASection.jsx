import React from "react";
import { useRecoilState } from "recoil";
import { routerState } from "../../state/atoms";

const CTASection = () => {
  const [currentPage, setCurrentPage] = useRecoilState(routerState);

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-6">
          Don't waste time in COVID-19 pandemic. Develop your skills.
        </h2>
        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
          High-definition video is video of higher resolution and quality than
          standard-definition. While there is no standardized meaning for
          high-definition, generally any video image with considerably more
          detail.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setCurrentPage("courses")}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Courses
          </button>
          <button
            onClick={() => setCurrentPage("about")}
            className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
