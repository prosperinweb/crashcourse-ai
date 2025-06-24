import type { Quiz as QuizType } from "../types";
import { Quiz } from "./Quiz";

interface QuizSectionProps {
  originalQuiz: QuizType;
  aiQuizzes: QuizType[];
  onQuizComplete: () => void;
}

export const QuizSection = ({
  originalQuiz,
  aiQuizzes,
  onQuizComplete,
}: QuizSectionProps) => (
  <div className="mt-8 border-t-2 border-teal-500 pt-6">
    <h3 className="text-2xl font-bold text-teal-400 mb-4">Quiz Time!</h3>
    {originalQuiz && (
      <Quiz
        quiz={originalQuiz}
        isAiGenerated={false}
        onQuizComplete={onQuizComplete}
      />
    )}
    {aiQuizzes.map((quiz, index) => (
      <Quiz
        key={index}
        quiz={quiz}
        isAiGenerated={true}
        onQuizComplete={onQuizComplete}
      />
    ))}
  </div>
);
