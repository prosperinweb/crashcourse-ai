import { useState } from "react";
import { toast } from "react-hot-toast";
import type { TopicData, Quiz } from "../types";
import { callGeminiAPI } from "../utils/geminiApi";

interface UseGenerateQuizProps {
  topicData: TopicData;
  topic: string;
  addAiQuiz: (topic: string, quiz: Quiz) => void;
}

interface UseDiveDeeperProps {
  topicData: TopicData;
  topic: string;
  updateTopicContent: (topic: string, newTopicData: TopicData) => void;
}

/**
 * Custom hook for generating AI quizzes
 * Manages loading state and error handling for quiz generation
 */
export const useGenerateQuiz = ({
  topicData,
  topic,
  addAiQuiz,
}: UseGenerateQuizProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const generateQuiz = async () => {
    setIsLoading(true);

    try {
      const prompt = `You are an instructor. Based on the content about '${
        topicData.title
      }', generate a new, unique, multiple choice quiz question. The question should test a core concept. Content: ${topicData.chunks
        .map((c) => c.content)
        .join(" ")}`;

      const schema = {
        type: "OBJECT",
        properties: {
          question: { type: "STRING" },
          type: { type: "STRING", enum: ["multiple-choice"] },
          options: { type: "ARRAY", items: { type: "STRING" } },
          answer: { type: "STRING" },
        },
        required: ["question", "type", "options", "answer"],
      };

      const result = await callGeminiAPI(prompt, schema);
      const parsedQuiz = JSON.parse(result);

      addAiQuiz(topic, parsedQuiz);
      toast.success("Quiz generated successfully! ✨");
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { generateQuiz, isLoading };
};

/**
 * Custom hook for the "Dive Deeper" AI feature
 * Manages loading state and error handling for comprehensive content expansion
 */
export const useDiveDeeper = ({
  topicData,
  topic,
  updateTopicContent,
}: UseDiveDeeperProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const diveDeeper = async () => {
    setIsLoading(true);

    try {
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
      const parsedTopicData = JSON.parse(result);

      updateTopicContent(topic, parsedTopicData);
      toast.success("Dived deeper! Enhanced content available! 🚀");
    } catch (error) {
      console.error("Failed to dive deeper:", error);
      toast.error("Failed to expand content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { diveDeeper, isLoading };
};
