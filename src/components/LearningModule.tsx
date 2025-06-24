import { useState, useEffect } from "react";
import { BookOpen, Loader, Sparkles } from "lucide-react";
import type { TopicData, CourseData } from "../types";
import { CodeBlock } from "./CodeBlock";
import { Mnemonic } from "./Mnemonic";
import { useDiveDeeper } from "../hooks/useAiFeatures";

interface LearningModuleProps {
  topic: string;
  topicData: TopicData;
  updateProgress: (topic: string, chunkIndex: number) => void;
  progress: number;
  courseData: CourseData;
  updateTopicContent: (topic: string, newTopicData: TopicData) => void;
  hasDivedDeeper: boolean;
  isLastTopic: boolean;
  isTopicQuizCompleted: boolean;
  onGenerateNewCourse: () => void;
}

export const LearningModule = ({
  topic,
  topicData,
  updateProgress,
  progress,
  updateTopicContent,
  hasDivedDeeper,
  isLastTopic,
  isTopicQuizCompleted,
  onGenerateNewCourse,
}: LearningModuleProps) => {
  const [activeChunk, setActiveChunk] = useState(0);

  // Use custom hook for dive deeper functionality
  const { diveDeeper, isLoading: isDivingDeeper } = useDiveDeeper({
    topicData,
    topic,
    updateTopicContent,
  });

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

        <div className="mt-6 border-t border-gray-700 pt-6">
          <button
            onClick={diveDeeper}
            disabled={isDivingDeeper || hasDivedDeeper}
            className="w-full px-4 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center justify-center text-base"
          >
            {isDivingDeeper ? (
              <Loader className="animate-spin mr-2" />
            ) : hasDivedDeeper ? (
              "Dived Deeper ✔️"
            ) : (
              <>
                <Sparkles className="mr-2" />
                Dive Deeper into {topicData.title}
              </>
            )}
          </button>
        </div>
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

      {/* Progress indicator */}
      {progress === 100 && (
        <div className="mt-8">
          {isLastTopic && isTopicQuizCompleted ? (
            // Course is completely finished
            <div className="p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500 rounded-lg text-center">
              <p className="text-green-300 font-semibold mb-3">
                🎉 Congratulations! You've completed the entire course!
              </p>
              <button
                onClick={onGenerateNewCourse}
                className="px-6 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition"
              >
                Generate New Course →
              </button>
            </div>
          ) : (
            // Topic completed, quiz will appear or is in progress
            <div className="p-4 bg-green-900/20 border border-green-500 rounded-lg text-center">
              <p className="text-green-300 font-semibold">
                🎉 Topic completed! Quiz will appear shortly...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
