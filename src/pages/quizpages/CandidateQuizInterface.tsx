"use client";

import { useState } from "react";
import { useQuizSocket } from "@/context/QuizSocketContext";

export const CandidateQuizInterface = () => {
  const {
    quizState,
    isLoading,
    isConnected,
    sendAnswer,
    submitQuiz,
  } = useQuizSocket();

  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading || !quizState) {
    return <div>Loading quiz...</div>;
  }

  if (!isConnected) {
    return <div>Connecting to quiz...</div>;
  }

  if (quizState.state === "ended") {
    return <div>The quiz has ended.</div>;
  }

  if (quizState.state !== "active") {
    return <div>Waiting for quiz to start...</div>;
  }

  const questions = quizState.questions ?? [];
  const answers = quizState.answers ?? {};

  const currentQuestion = questions[currentIndex];

  const unansweredCount = questions.filter(
  (q) => answers[q.question_id] === undefined
).length;

  const handleSelectAnswer = (questionId: number, optionId: number) => {
    sendAnswer(questionId, optionId);
  };

  const handleSubmit = () => {

    submitQuiz();
  };

  const formatTime = (remTimeMs : number) => {
    const totalSeconds = Math.floor((remTimeMs?? 0) / 1000);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

   return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    
  }
    
  return (
    <div className="p-6 space-y-6">
      {/* Timer */}
      <div className="text-right font-medium">
        Time left:{" "}
        {
        quizState.remainingTimeMs
          ? formatTime(quizState.remainingTimeMs)
          : 0}
      </div>

      {/* Question Navigation */}
      <div className="flex gap-2 flex-wrap">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`px-3 py-1 border rounded ${
              index === currentIndex ? "bg-black text-white" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Current Question */}
      {currentQuestion && (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold">
      Question {currentIndex + 1}
    </h2>

    <p>{currentQuestion.question_text}</p>

    <div className="space-y-2">
      {currentQuestion.options.map((option) => {
        const isSelected =
          answers[currentQuestion.question_id] === option.option_id;

        return (
          <button
            key={option.option_id}
            onClick={() =>
              handleSelectAnswer(
                currentQuestion.question_id,
                option.option_id
              )
            }
            className={`block w-full text-left px-4 py-2 border rounded ${
              isSelected ? "bg-black text-white" : ""
            }`}
          >
            {option.option_text}
          </button>
        );
      })}
    </div>
  </div>
)}



      {/* Footer */}
      <div className="flex justify-between items-center pt-4">
        <div>
          Unanswered: {unansweredCount}
        </div>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};


