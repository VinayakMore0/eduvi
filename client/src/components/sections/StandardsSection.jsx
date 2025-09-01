import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { BookOpen, Star } from "lucide-react";
import { selectedStandardState, standardsDataState } from "../../state/atoms";
import { selectedStandardSelector } from "../../state/selectors";

const StandardsSection = () => {
  const [selectedStandard, setSelectedStandard] = useRecoilState(
    selectedStandardState
  );
  const standards = useRecoilValue(standardsDataState);
  const currentStandard = useRecoilValue(selectedStandardSelector);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Qualified lessons for students
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A lesson or class is a structured period of time where learning is
            intended to occur. It involves one or more students being taught by
            a teacher or instructor.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Standards List */}
          <div className="space-y-4">
            {standards.slice(0, 8).map((standard) => (
              <div
                key={standard.id}
                onClick={() => setSelectedStandard(standard.id)}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedStandard === standard.id
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-900 hover:shadow-md hover:bg-blue-50"
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">{standard.title}</h3>
                <p
                  className={`${
                    selectedStandard === standard.id
                      ? "text-blue-100"
                      : "text-gray-600"
                  }`}
                >
                  {standard.description}
                </p>
              </div>
            ))}
          </div>

          {/* Selected Standard Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-6 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-white" size={40} />
                </div>
                <div className="text-gray-600 font-medium">Course Preview</div>
              </div>
            </div>

            {currentStandard && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {currentStandard.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {currentStandard.description}
                </p>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star
                        className="text-yellow-400 fill-current"
                        size={16}
                      />
                      <span className="text-sm text-gray-600">
                        {currentStandard.rating}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">24 lessons</div>
                    <div className="text-sm text-gray-600">3.5 hours</div>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Start Learning
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StandardsSection;
