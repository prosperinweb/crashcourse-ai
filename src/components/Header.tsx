import { Zap, Wand2 } from "lucide-react";

interface HeaderProps {
  setIsGeneratingCourse: (isGenerating: boolean) => void;
  courseTitle: string;
}

export const Header = ({ setIsGeneratingCourse, courseTitle }: HeaderProps) => (
  <header className="bg-gray-800 shadow-lg">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-xl md:text-3xl font-bold text-teal-400 flex items-center">
        <Zap className="mr-2 text-yellow-400" />
        {courseTitle} AI Course
      </h1>
      <button
        onClick={() => setIsGeneratingCourse(true)}
        className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 transition"
      >
        <Wand2 size={20} />
        <span className="hidden sm:inline">Create New Course</span>
      </button>
    </div>
  </header>
);
