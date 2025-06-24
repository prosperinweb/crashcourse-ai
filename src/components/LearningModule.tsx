import { useState, useEffect } from "react";
import { BookOpen, Loader, Sparkles, BrainCircuit } from "lucide-react";
import type { TopicData, Quiz, CourseData } from "../types";
import { CodeBlock } from "./CodeBlock";
import { Mnemonic } from "./Mnemonic";
import { AiFeatures } from "./AiFeatures";
import { QuizSection } from "./QuizSection";
import { callGeminiAPI } from "../utils/geminiApi";

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
  updateTopicContent: (topic: string, newTopicData: TopicData) => void;
  hasDivedDeeper: boolean;
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
  updateTopicContent,
  hasDivedDeeper,
}: LearningModuleProps) => {
  const [activeChunk, setActiveChunk] = useState(0);
  const [isDivingDeeper, setIsDivingDeeper] = useState(false);

  useEffect(() => {
    setActiveChunk(0);
  }, [topic]);

  const goToChunk = (index: number) => {
    if (index >= 0 && index < topicData.chunks.length) {
      setActiveChunk(index);
      updateProgress(topic, index);
    }
  };

  const diveDeeper = async () => {
    setIsDivingDeeper(true);
    const prompt = `You are an expert educator. The user wants to "dive deeper" into the topic of "${
      topicData.title
    }". Their current learning module is: ${JSON.stringify(
      topicData
    )}. Please generate a new, more detailed and comprehensive version of this learning module. Expand on the existing content, add more examples, and introduce more advanced concepts related to the topic. The structure of your output must be a single JSON object that matches this schema: { "title": "string", "learningObjectives": ["string"], "chunks": [{ "title": "string", "content": "string", "code": "string", "mnemonic": "string" }], "quiz": { "question": "string", "type": "string", "options": ["string"], "answer": "string" } }. Make the content about 50-75% longer than the original.`;
    const schema = {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        learningObjectives: {
          type: "ARRAY",
          items: { type: "STRING" },
        },
        chunks: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              content: { type: "STRING" },
              code: { type: "STRING" },
              mnemonic: { type: "STRING" },
            },
            required: ["title", "content"],
          },
        },
        quiz: {
          type: "OBJECT",
          properties: {
            question: { type: "STRING" },
            type: { type: "STRING", enum: ["multiple-choice"] },
            options: { type: "ARRAY", items: { type: "STRING" } },
            answer: { type: "STRING" },
          },
          required: ["question", "type", "options", "answer"],
        },
      },
      required: ["title", "learningObjectives", "chunks", "quiz"],
    };

    const result = await callGeminiAPI(prompt, schema);
    try {
      const parsedTopicData = JSON.parse(result);
      updateTopicContent(topic, parsedTopicData);
    } catch (e) {
      console.error("Failed to parse regenerated topic data", e);
    }
    setIsDivingDeeper(false);
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
