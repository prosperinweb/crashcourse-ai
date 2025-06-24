import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import type { TopicData, Quiz, CourseData } from "../types";
import { CodeBlock } from "./CodeBlock";
import { Mnemonic } from "./Mnemonic";
import { AiFeatures } from "./AiFeatures";
import { QuizSection } from "./QuizSection";

interface LearningModuleProps {
  topic: string;
  topicData: TopicData;
  updateProgress: (topic: string, chunkIndex: number) => void;
  progress: number;
  addAiQuiz: (topic: string, quiz: Quiz) => void;
  aiQuizzes: Quiz[];
  courseData: CourseData;
  onQuizComplete: () => void;
  isTopicCompleted: boolean;
  handleNextTopic: () => void;
  isLastTopic: boolean;
}

export const LearningModule = ({
  topic,
  topicData,
  updateProgress,
  progress,
  addAiQuiz,
  aiQuizzes,
  onQuizComplete,
  isTopicCompleted,
  handleNextTopic,
  isLastTopic,
}: LearningModuleProps) => {
  const [activeChunk, setActiveChunk] = useState(0);

  useEffect(() => {
    setActiveChunk(0);
  }, [topic]);

  const goToChunk = (index: number) => {
    if (index >= 0 && index < topicData.chunks.length) {
      setActiveChunk(index);
      updateProgress(topic, index);
    }
  };

  const currentChunk = topicData.chunks[activeChunk];

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-teal-400 mb-2 flex items-center">
          <BookOpen className="mr-2" />
          Learning Objectives
        </h3>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          {topicData.learningObjectives.map((obj, i) => (
            <li key={i}>{obj}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-bold text-yellow-400">
            {currentChunk.title}
          </h4>
          <span className="text-sm font-mono bg-gray-700 px-2 py-1 rounded">
            Chunk {activeChunk + 1} / {topicData.chunks.length}
          </span>
        </div>

        <p className="text-gray-300 mb-4 leading-relaxed">
          {currentChunk.content}
        </p>

        {currentChunk.code && <CodeBlock code={currentChunk.code} />}

        {currentChunk.mnemonic && <Mnemonic mnemonic={currentChunk.mnemonic} />}

        <AiFeatures topicData={topicData} addAiQuiz={addAiQuiz} topic={topic} />
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => goToChunk(activeChunk - 1)}
          disabled={activeChunk === 0}
          className="px-4 py-2 bg-teal-600 rounded-lg hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
        >
          Previous Chunk
        </button>
        <button
          onClick={() => goToChunk(activeChunk + 1)}
          disabled={activeChunk === topicData.chunks.length - 1}
          className="px-4 py-2 bg-teal-600 rounded-lg hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
        >
          Next Chunk
        </button>
      </div>

      {progress === 100 && (
        <QuizSection
          originalQuiz={topicData.quiz}
          aiQuizzes={aiQuizzes}
          onQuizComplete={onQuizComplete}
        />
      )}

      {isTopicCompleted && (
        <div className="mt-8 text-center">
          <button
            onClick={handleNextTopic}
            disabled={isLastTopic}
            className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
          >
            {isLastTopic ? "Course Completed!" : "Next Topic →"}
          </button>
        </div>
      )}
    </div>
  );
};
