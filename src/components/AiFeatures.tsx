import { BrainCircuit, Loader, Sparkles } from "lucide-react";
import type { TopicData, Quiz } from "../types";
import { useGenerateQuiz, useGenerateMnemonic } from "../hooks/useAiFeatures";

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
  // Use custom hooks for AI features
  const { generateQuiz, isLoading: isGeneratingQuiz } = useGenerateQuiz({
    topicData,
    topic,
    addAiQuiz,
  });

  const {
    generateMnemonic,
    isLoading: isGeneratingMnemonic,
    mnemonic,
  } = useGenerateMnemonic({
    topicData,
  });

  return (
    <div className="mt-8 p-4 bg-gray-700/50 rounded-lg border border-teal-500/30">
      <h4 className="font-bold text-lg text-teal-300 flex items-center mb-3">
        <BrainCircuit className="mr-2" />
        AI Learning Tools
      </h4>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={generateQuiz}
          disabled={isGeneratingQuiz}
          className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 disabled:bg-gray-600 disabled:text-gray-400 transition flex items-center justify-center"
        >
          {isGeneratingQuiz ? (
            <Loader className="animate-spin mr-2" />
          ) : (
            <Sparkles className="mr-2" />
          )}
          Generate New Quiz ✨
        </button>
        <button
          onClick={generateMnemonic}
          disabled={isGeneratingMnemonic}
          className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 disabled:bg-gray-600 disabled:text-gray-400 transition flex items-center justify-center"
        >
          {isGeneratingMnemonic ? (
            <Loader className="animate-spin mr-2" />
          ) : (
            <Sparkles className="mr-2" />
          )}
          Generate Mnemonic ✨
        </button>
      </div>
      {mnemonic && (
        <div className="mt-4 p-3 bg-yellow-900/20 border-l-2 border-yellow-400 rounded-r-md">
          <p className="text-yellow-200">{mnemonic}</p>
        </div>
      )}
    </div>
  );
};
