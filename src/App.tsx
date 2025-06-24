import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { Info, X } from "lucide-react";
import type {
  CourseData,
  Progress,
  AiGeneratedQuizzes,
  Quiz,
  TopicData,
} from "./types";
import { initialCourseContent } from "./data/initialCourseContent";
import { Header } from "./components/Header";
import { CourseGenerator } from "./components/CourseGenerator";
import { TopicNavigator } from "./components/TopicNavigator";
import { LearningModule } from "./components/LearningModule";
import { Dashboard } from "./components/Dashboard";
import { Footer } from "./components/Footer";

const App = () => {
  const [courseData, setCourseData] =
    useState<CourseData>(initialCourseContent);
  const [activeTopic, setActiveTopic] = useState(
    Object.keys(initialCourseContent)[0]
  );
  const [progress, setProgress] = useState<Progress>(() => {
    const topics = Object.keys(initialCourseContent);
    return topics.reduce((acc, topic) => ({ ...acc, [topic]: 0 }), {});
  });
  const [badges, setBadges] = useState<string[]>([]);
  const [aiGeneratedQuizzes, setAiGeneratedQuizzes] =
    useState<AiGeneratedQuizzes>({});
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);
  const [courseTitle, setCourseTitle] = useState("Advanced TypeScript");
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  const [divedDeeperTopics, setDivedDeeperTopics] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isInitialCourse, setIsInitialCourse] = useState(true);
  const [showInitialCourseNote, setShowInitialCourseNote] = useState(true);

  useEffect(() => {
    if (badges.length > 0 && badges.length === Object.keys(courseData).length) {
      setShowConfetti(true);
    }
  }, [badges, courseData]);

  const resetCourse = (newCourseData: CourseData, newTitle: string) => {
    setCourseData(newCourseData);
    setCourseTitle(newTitle);
    const newTopics = Object.keys(newCourseData);
    setActiveTopic(newTopics[0]);
    const newProgress = newTopics.reduce(
      (acc, topic) => ({ ...acc, [topic]: 0 }),
      {}
    );
    setProgress(newProgress);
    setBadges([]);
    setAiGeneratedQuizzes({});
    setCompletedQuizzes([]);
    setDivedDeeperTopics([]);
    setShowConfetti(false);
    setIsInitialCourse(false);
  };

  const currentTopicData = courseData[activeTopic];
  const topicKeys = Object.keys(courseData);
  const activeTopicIndex = topicKeys.indexOf(activeTopic);

  const updateProgress = (topic: string, chunkIndex: number) => {
    if (!currentTopicData) return;
    const newProgressPercentage =
      ((chunkIndex + 1) / currentTopicData.chunks.length) * 100;
    const newProgress = {
      ...progress,
      [topic]: Math.max(progress[topic] || 0, newProgressPercentage),
    };
    setProgress(newProgress);

    if (newProgressPercentage === 100 && !badges.includes(topic)) {
      setBadges([...badges, topic]);
    }
  };

  const navigateTopic = (direction: number) => {
    const newIndex = activeTopicIndex + direction;
    if (newIndex >= 0 && newIndex < topicKeys.length) {
      setActiveTopic(topicKeys[newIndex]);
    }
  };

  const handleNextTopic = () => {
    const newIndex = activeTopicIndex + 1;
    if (newIndex < topicKeys.length) {
      setActiveTopic(topicKeys[newIndex]);
    }
  };

  const handleQuizComplete = (topic: string) => {
    if (!completedQuizzes.includes(topic)) {
      setCompletedQuizzes([...completedQuizzes, topic]);
    }
  };

  const updateTopicContent = (topic: string, newTopicData: TopicData) => {
    setCourseData((prev) => ({
      ...prev,
      [topic]: newTopicData,
    }));
    if (!divedDeeperTopics.includes(topic)) {
      setDivedDeeperTopics([...divedDeeperTopics, topic]);
    }
  };

  const addAiQuiz = (topic: string, quiz: Quiz) => {
    setAiGeneratedQuizzes((prev) => ({
      ...prev,
      [topic]: [...(prev[topic] || []), quiz],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {showConfetti && <Confetti recycle={false} />}
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
                progress={progress[activeTopic] || 0}
                addAiQuiz={addAiQuiz}
                aiQuizzes={aiGeneratedQuizzes[activeTopic] || []}
                courseData={courseData}
                onQuizComplete={() => handleQuizComplete(activeTopic)}
                isTopicCompleted={completedQuizzes.includes(activeTopic)}
                handleNextTopic={handleNextTopic}
                isLastTopic={activeTopicIndex === topicKeys.length - 1}
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
