import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Sparkles } from "lucide-react";
import type { Quiz as QuizType } from "../types";
import { CodeBlock } from "./CodeBlock";

interface QuizProps {
  quiz: QuizType;
  isAiGenerated: boolean;
}

export const Quiz = ({ quiz, isAiGenerated }: QuizProps) => {
  const [droppedItem, setDroppedItem] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    resetQuiz();
  }, [quiz]);

  const handleDragStart = (e: React.DragEvent, option: string) =>
    e.dataTransfer.setData("text/plain", option);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDroppedItem(e.dataTransfer.getData("text/plain"));
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const checkAnswer = () => {
    let answerCorrect = false;
    if (quiz.type === "drag-and-drop") {
      answerCorrect = droppedItem === quiz.answer;
    } else {
      answerCorrect = selectedOption === quiz.answer;
    }
    setIsCorrect(answerCorrect);
    setShowFeedback(true);
  };

  const resetQuiz = () => {
    setDroppedItem(null);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const dropZoneClass = `mt-2 h-12 w-28 flex items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
    droppedItem
      ? "bg-teal-900 border-teal-500"
      : "bg-gray-700 border-gray-500 hover:bg-gray-600"
  }`;

  const finalCode = quiz.codeSnippet
    ? quiz.codeSnippet.replace("____", droppedItem || "____")
    : null;

  return (
    <div
      className={`mt-6 pt-6 border-t ${
        isAiGenerated ? "border-dashed border-yellow-500" : "border-gray-700"
      }`}
    >
      {isAiGenerated && (
        <p className="text-sm font-bold text-yellow-400 mb-2 flex items-center">
          <Sparkles size={16} className="mr-1" />
          AI-Generated Question
        </p>
      )}
      <p className="text-gray-300 mb-4">{quiz.question}</p>

      {quiz.type === "drag-and-drop" ? (
        <>
          <div className="flex flex-wrap gap-4 mb-4">
            {quiz.options.map((option) => (
              <div
                key={option}
                draggable
                onDragStart={(e) => handleDragStart(e, option)}
                className="cursor-grab bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                {option}
              </div>
            ))}
          </div>
          <p className="mb-2 font-mono text-gray-400">Drop here:</p>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={dropZoneClass}
          >
            {droppedItem && (
              <span className="font-mono text-cyan-300">{droppedItem}</span>
            )}
          </div>
        </>
      ) : (
        // multiple-choice
        <div className="flex flex-col gap-2 mb-4">
          {quiz.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedOption(option)}
              className={`text-left p-3 rounded-lg transition ${
                selectedOption === option
                  ? "bg-teal-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {finalCode && <CodeBlock code={finalCode} />}

      {!showFeedback && (
        <button
          onClick={checkAnswer}
          disabled={
            quiz.type === "drag-and-drop" ? !droppedItem : !selectedOption
          }
          className="mt-4 px-6 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 disabled:bg-gray-600 transition"
        >
          Check Answer
        </button>
      )}

      {showFeedback && (
        <div className="mt-4">
          {isCorrect ? (
            <div className="flex items-center p-4 bg-green-900/50 text-green-300 rounded-lg">
              <CheckCircle className="mr-3" />
              <p>
                <span className="font-bold">Correct!</span> Well done.
              </p>
            </div>
          ) : (
            <div className="flex items-center p-4 bg-red-900/50 text-red-300 rounded-lg">
              <XCircle className="mr-3" />
              <p>
                <span className="font-bold">Not quite.</span> The correct answer
                is{" "}
                <span className="font-mono bg-gray-700 px-1 rounded">
                  {quiz.answer}
                </span>
                .
              </p>
            </div>
          )}
          <button
            onClick={resetQuiz}
            className="mt-4 px-6 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
