import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight, Trophy } from "lucide-react";
import type { TopicData, Quiz as QuizType } from "../types";
import { Quiz } from "./Quiz";
import { useGenerateQuiz } from "../hooks/useAiFeatures";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicData: TopicData;
  topic: string;
  aiQuizzes: QuizType[];
  addAiQuiz: (topic: string, quiz: QuizType) => void;
  onQuizComplete: () => void;
  onNextTopic: () => void;
  isLastTopic: boolean;
  onGenerateNewCourse: () => void;
}

export const QuizModal = ({
  isOpen,
  onClose,
  topicData,
  topic,
  aiQuizzes,
  addAiQuiz,
  onQuizComplete,
  onNextTopic,
  isLastTopic,
  onGenerateNewCourse,
}: QuizModalProps) => {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [showCourseCompletion, setShowCourseCompletion] = useState(false);

  // Use custom hook for generating quizzes
  const { generateQuiz, isLoading: isGeneratingQuiz } = useGenerateQuiz({
    topicData,
    topic,
    addAiQuiz,
  });

  // Get all available quizzes (original + AI generated)
  const allQuizzes = [topicData.quiz, ...aiQuizzes];

  useEffect(() => {
    if (isOpen) {
      setQuizCompleted(false);
      setActiveQuizIndex(0);
      setShowCourseCompletion(false);
    }
  }, [isOpen]);

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    onQuizComplete();

    // If this is the last topic and we've completed a quiz, show course completion
    if (isLastTopic) {
      setShowCourseCompletion(true);
    }
  };

  const handleNextQuiz = () => {
    if (activeQuizIndex < allQuizzes.length - 1) {
      setActiveQuizIndex(activeQuizIndex + 1);
      setQuizCompleted(false);
    }
  };

  const handleNextTopic = () => {
    onClose();
    onNextTopic();
  };

  const handleGenerateNewCourse = () => {
    onClose();
    onGenerateNewCourse();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-teal-400">
            {showCourseCompletion ? "Course Completed! 🎉" : "Quiz Time! 🎯"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {showCourseCompletion ? (
            // Course completion celebration
            <div className="text-center">
              <div className="mb-6">
                <Trophy className="mx-auto text-yellow-400 mb-4" size={64} />
                <h3 className="text-3xl font-bold text-yellow-400 mb-2">
                  Congratulations!
                </h3>
                <p className="text-gray-300 text-lg mb-4">
                  You've successfully completed the entire course!
                </p>
                <p className="text-gray-400">
                  Ready to learn something new? Generate a fresh course to
                  continue your learning journey.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGenerateNewCourse}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition flex items-center justify-center"
                >
                  <Sparkles className="mr-2" size={20} />
                  Generate New Course
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-2 text-gray-400 hover:text-white transition border border-gray-600 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            // Regular quiz content
            <>
              <div className="mb-4">
                <p className="text-gray-300 mb-2">
                  Topic:{" "}
                  <span className="text-yellow-400 font-semibold">
                    {topicData.title}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Quiz {activeQuizIndex + 1} of {allQuizzes.length}
                </p>
              </div>

              {/* Quiz Component */}
              {allQuizzes[activeQuizIndex] && (
                <Quiz
                  quiz={allQuizzes[activeQuizIndex]}
                  isAiGenerated={activeQuizIndex > 0}
                  onQuizComplete={handleQuizComplete}
                />
              )}

              {/* Generate Quiz Button */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <button
                  onClick={generateQuiz}
                  disabled={isGeneratingQuiz}
                  className="w-full px-4 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 disabled:bg-gray-600 disabled:text-gray-400 transition flex items-center justify-center"
                >
                  {isGeneratingQuiz ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full mr-2" />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2" size={20} />
                      Generate New Quiz ✨
                    </>
                  )}
                </button>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-700 flex flex-col sm:flex-row gap-4">
                {/* Next Quiz Button */}
                {activeQuizIndex < allQuizzes.length - 1 && (
                  <button
                    onClick={handleNextQuiz}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                  >
                    Next Quiz →
                  </button>
                )}

                {/* Next Topic Button - only show when quiz is completed */}
                {quizCompleted && !isLastTopic && (
                  <button
                    onClick={handleNextTopic}
                    className="flex-1 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                  >
                    Next Topic
                    <ArrowRight className="ml-2" size={20} />
                  </button>
                )}
              </div>

              {/* Skip Button */}
              <div className="mt-4">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 text-gray-400 hover:text-white transition text-sm"
                >
                  Skip for now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
