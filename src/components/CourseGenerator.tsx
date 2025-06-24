import { useState } from "react";
import { Loader, Wand2, XCircle } from "lucide-react";
import type { CourseData } from "../types";
import { callGeminiAPI } from "../utils/geminiApi";

interface CourseGeneratorProps {
  setIsGeneratingCourse: (isGenerating: boolean) => void;
  resetCourse: (newCourseData: CourseData, newTitle: string) => void;
}

export const CourseGenerator = ({
  setIsGeneratingCourse,
  resetCourse,
}: CourseGeneratorProps) => {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) {
      setError("Please enter a topic.");
      return;
    }
    setIsLoading(true);
    setError("");

    const prompt = `You are an expert instructional designer. Create a comprehensive and engaging crash course about "${topic}". The course should be broken down into 3-5 logical sub-topics. For each sub-topic, provide:
1. A clear 'title'.
2. A list of 2-3 specific 'learningObjectives'.
3. A series of 2-4 bite-sized 'chunks', where each chunk has a 'title', 'content', and an optional 'code' snippet if the topic is technical. The content should be educational and easy to digest.
4. A 'quiz' to test understanding. The quiz must have a 'type' ('multiple-choice' or 'drag-and-drop'), a 'question', an array of 'options', and the correct 'answer'. Also include an optional 'codeSnippet' for context if needed.

The entire output must be a single JSON object where keys are slug-style versions of the sub-topic titles, and values are the structured content for that sub-topic.`;

    const schema = {
      type: "OBJECT",
      patternProperties: {
        "^[a-zA-Z0-9_-]+$": {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            learningObjectives: { type: "ARRAY", items: { type: "STRING" } },
            chunks: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING" },
                  content: { type: "STRING" },
                  code: { type: "STRING" },
                },
                required: ["title", "content"],
              },
            },
            quiz: {
              type: "OBJECT",
              properties: {
                type: {
                  type: "STRING",
                  enum: ["multiple-choice", "drag-and-drop"],
                },
                question: { type: "STRING" },
                options: { type: "ARRAY", items: { type: "STRING" } },
                answer: { type: "STRING" },
                codeSnippet: { type: "STRING" },
              },
              required: ["type", "question", "options", "answer"],
            },
          },
          required: ["title", "learningObjectives", "chunks", "quiz"],
        },
      },
    };

    try {
      const result = await callGeminiAPI(prompt, schema);
      const newCourse = JSON.parse(result);

      if (Object.keys(newCourse).length === 0) {
        throw new Error("API returned an empty course object.");
      }

      resetCourse(newCourse, topic);
      setIsGeneratingCourse(false);
    } catch (e) {
      console.error("Failed to generate course:", e);

      if (e instanceof Error) {
        // Check for specific API key error
        if (e.message.includes("API key")) {
          setError("API key error. Please check your environment variables.");
        } else if (e.message.includes("quota") || e.message.includes("limit")) {
          setError("API quota exceeded. Please try again later.");
        } else if (e.message.includes("authentication")) {
          setError("Authentication failed. Please check your API key.");
        } else {
          setError(
            `Error: ${e.message}. Please try a different topic or try again later.`
          );
        }
      } else {
        setError(
          "Sorry, there was an error generating the course. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 shadow-2xl w-full max-w-lg relative">
        <button
          onClick={() => setIsGeneratingCourse(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <XCircle />
        </button>
        <h2 className="text-2xl font-bold text-teal-400 mb-4">
          Create a New Course
        </h2>
        <p className="text-gray-400 mb-6">
          What would you like to learn about? Enter a topic below.
        </p>
        <form onSubmit={handleGenerate}>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'React Hooks', 'Quantum Physics', 'Italian Cooking'"
            className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-teal-500"
            disabled={isLoading}
          />
          {error && <p className="text-red-400 mt-2">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 px-4 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 transition flex items-center justify-center disabled:bg-gray-600"
          >
            {isLoading ? (
              <Loader className="animate-spin mr-2" />
            ) : (
              <Wand2 className="mr-2" />
            )}
            {isLoading ? "Generating..." : "Generate Course"}
          </button>
        </form>
      </div>
    </div>
  );
};
