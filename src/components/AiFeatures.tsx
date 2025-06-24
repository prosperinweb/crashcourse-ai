import { useState } from "react";
import { BrainCircuit, Loader, Sparkles } from "lucide-react";
import type { TopicData, Quiz } from "../types";
import { callGeminiAPI } from "../utils/geminiApi";

interface AiFeaturesProps {
  topicData: TopicData;
  addAiQuiz: (topic: string, quiz: Quiz) => void;
  topic: string;
}

export const AiFeatures = ({
  topicData,
  addAiQuiz,
  topic,
}: AiFeaturesProps) => {
  const [isLoading, setIsLoading] = useState({ quiz: false, mnemonic: false });
  const [newMnemonic, setNewMnemonic] = useState("");

  const generateQuiz = async () => {
    setIsLoading((prev) => ({ ...prev, quiz: true }));
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
    try {
      const parsedQuiz = JSON.parse(result);
      addAiQuiz(topic, parsedQuiz);
    } catch (e) {
      console.error("Failed to parse quiz JSON", e);
    }
    setIsLoading((prev) => ({ ...prev, quiz: false }));
  };

  const generateMnemonic = async () => {
    setIsLoading((prev) => ({ ...prev, mnemonic: true }));
    setNewMnemonic("");
    const prompt = `You are a creative learning assistant. Create a simple, memorable, and slightly humorous mnemonic to help remember the concept of '${topicData.title}'. The concept is about: ${topicData.chunks[0].content}`;
    const result = await callGeminiAPI(prompt);
    setNewMnemonic(result);
    setIsLoading((prev) => ({ ...prev, mnemonic: false }));
  };

  return (
    <div className="mt-8 p-4 bg-gray-700/50 rounded-lg border border-teal-500/30">
      <h4 className="font-bold text-lg text-teal-300 flex items-center mb-3">
        <BrainCircuit className="mr-2" />
        AI Learning Tools
      </h4>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={generateQuiz}
          disabled={isLoading.quiz}
          className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 disabled:bg-gray-600 transition flex items-center justify-center"
        >
          {isLoading.quiz ? (
            <Loader className="animate-spin mr-2" />
          ) : (
            <Sparkles className="mr-2" />
          )}
          Generate New Quiz ✨
        </button>
        <button
          onClick={generateMnemonic}
          disabled={isLoading.mnemonic}
          className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 disabled:bg-gray-600 transition flex items-center justify-center"
        >
          {isLoading.mnemonic ? (
            <Loader className="animate-spin mr-2" />
          ) : (
            <Sparkles className="mr-2" />
          )}
          Generate Mnemonic ✨
        </button>
      </div>
      {newMnemonic && (
        <div className="mt-4 p-3 bg-yellow-900/20 border-l-2 border-yellow-400 rounded-r-md">
          <p className="text-yellow-200">{newMnemonic}</p>
        </div>
      )}
    </div>
  );
};
