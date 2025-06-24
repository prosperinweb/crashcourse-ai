import { ChevronLeft, ChevronRight } from "lucide-react";

interface TopicNavigatorProps {
  navigateTopic: (direction: number) => void;
  activeTopicIndex: number;
  topicKeys: string[];
  currentTopicTitle: string;
}

export const TopicNavigator = ({
  navigateTopic,
  activeTopicIndex,
  topicKeys,
  currentTopicTitle,
}: TopicNavigatorProps) => (
  <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-8 shadow-md">
    <button
      onClick={() => navigateTopic(-1)}
      disabled={activeTopicIndex === 0}
      className="p-2 rounded-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronLeft size={24} />
    </button>
    <h2 className="text-2xl font-bold text-center text-teal-300">
      {currentTopicTitle}
    </h2>
    <button
      onClick={() => navigateTopic(1)}
      disabled={activeTopicIndex === topicKeys.length - 1}
      className="p-2 rounded-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronRight size={24} />
    </button>
  </div>
);
