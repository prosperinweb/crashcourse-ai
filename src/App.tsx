import { Suspense, lazy } from "react";
import { Info, X } from "lucide-react";
import { useCourseStore } from "./store/courseStore";
import { Header } from "./components/Header";
import { CourseGenerator } from "./components/CourseGenerator";
import { TopicNavigator } from "./components/TopicNavigator";
import { LearningModule } from "./components/LearningModule";
import { Dashboard } from "./components/Dashboard";
import { Footer } from "./components/Footer";

// Lazy load the Confetti component for better performance
const Confetti = lazy(() => import("react-confetti"));

const App = () => {
  const {
    // State
    courseData,
    activeTopic,
    progress,
    badges,
    aiGeneratedQuizzes,
    courseTitle,
    completedQuizzes,
    divedDeeperTopics,
    showConfetti,
    isInitialCourse,
    showInitialCourseNote,
    isGeneratingCourse,

    // Actions
    resetCourse,
    updateProgress,
    navigateTopic,
    handleNextTopic,
    handleQuizComplete,
    updateTopicContent,
    addAiQuiz,
    setShowInitialCourseNote,
    setIsGeneratingCourse,

    // Computed getters
    getCurrentTopicData,
    getTopicKeys,
    getActiveTopicIndex,
    getCurrentTopicProgress,
    getIsLastTopic,
  } = useCourseStore();

  const currentTopicData = getCurrentTopicData();
  const topicKeys = getTopicKeys();
  const activeTopicIndex = getActiveTopicIndex();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {showConfetti && (
        <Suspense fallback={null}>
          <Confetti recycle={false} />
        </Suspense>
      )}
      <Header
        setIsGeneratingCourse={setIsGeneratingCourse}
        courseTitle={courseTitle}
      />
      {isGeneratingCourse && (
        <CourseGenerator
          setIsGeneratingCourse={setIsGeneratingCourse}
          resetCourse={resetCourse}
        />
      )}
      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {isInitialCourse && showInitialCourseNote && (
            <div
              className="bg-blue-900/50 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg relative mb-4 flex items-center"
              role="alert"
            >
              <Info className="h-5 w-5 mr-3 text-blue-400 flex-shrink-0" />
              <div>
                <strong className="font-bold">Welcome! </strong>
                <span className="block sm:inline">
                  This is an example course. You can generate your own custom
                  course using the "New Course" button above.
                </span>
              </div>
              <button
                className="absolute top-2 right-2 p-1"
                onClick={() => setShowInitialCourseNote(false)}
                aria-label="Dismiss"
              >
                <X className="h-5 w-5 text-blue-300 hover:text-white" />
              </button>
            </div>
          )}
          {currentTopicData ? (
            <>
              <TopicNavigator
                navigateTopic={navigateTopic}
                activeTopicIndex={activeTopicIndex}
                topicKeys={topicKeys}
                currentTopicTitle={currentTopicData.title}
              />
              <LearningModule
                key={activeTopic}
                topic={activeTopic}
                topicData={currentTopicData}
                updateProgress={updateProgress}
                progress={getCurrentTopicProgress()}
                addAiQuiz={addAiQuiz}
                aiQuizzes={aiGeneratedQuizzes[activeTopic] || []}
                courseData={courseData}
                onQuizComplete={() => handleQuizComplete(activeTopic)}
                isTopicCompleted={completedQuizzes.includes(activeTopic)}
                handleNextTopic={handleNextTopic}
                isLastTopic={getIsLastTopic()}
                updateTopicContent={updateTopicContent}
                hasDivedDeeper={divedDeeperTopics.includes(activeTopic)}
              />
            </>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-teal-400">Welcome!</h2>
              <p className="mt-2 text-gray-400">
                Generate a new course to get started.
              </p>
            </div>
          )}
        </div>
        <Dashboard
          progress={progress}
          badges={badges}
          courseData={courseData}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;
