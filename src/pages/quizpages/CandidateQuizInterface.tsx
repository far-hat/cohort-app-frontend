import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuizSocket } from "@/context/QuizSocketContext";
import { useApiClient } from "@/hooks/useApiClient";
import { createQuizSessionApi } from "@/api/QuizSessionApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AnswerMap {
  [questionId: number]: number | null;
}

export const CandidateQuizInterface = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const numericQuizId = Number(quizId);

  const navigate = useNavigate();
  const { socket, quizState, isConnected } = useQuizSocket();
  const { request } = useApiClient();
  const quizSessionApi = createQuizSessionApi(request);

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = useMemo(
    () => questions[currentIndex],
    [questions, currentIndex]
  );

  // ---------- Fetch quiz state ----------
  useEffect(() => {
    if (!numericQuizId) return;

    const fetchState = async () => {
      try {
        const res = await quizSessionApi.getQuizState(numericQuizId);
        if (!res.success) throw new Error(res.message || "Failed to fetch quiz");

        setQuestions(res.data.questions || []);
        setRemainingTime(res.data.remainingTime ?? null);

        if (res.data.state === "ended") {
          toast.info("This quiz has already ended.");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to load quiz.");
      }
    };

    fetchState();
  }, [numericQuizId]);

  // ---------- Countdown timer ----------
  useEffect(() => {
    if (quizState?.state !== "active" || remainingTime === null) return;

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(interval);
          toast.info("Time is up. Submitting your quiz...");
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizState?.state, remainingTime]);

  // ---------- Socket listeners ----------
  useEffect(() => {
    if (!socket) return;

    const onPaused = () => toast.warning("Quiz has been paused.");
    const onResumed = () => toast.success("Quiz resumed.");
    const onEnded = () => {
      toast.info("Quiz has ended.");
      navigate("/candidate/thank-you");
    };

    socket.on("quiz_paused", onPaused);
    socket.on("quiz_resumed", onResumed);
    socket.on("quiz_ended", onEnded);

    return () => {
      socket.off("quiz_paused", onPaused);
      socket.off("quiz_resumed", onResumed);
      socket.off("quiz_ended", onEnded);
    };
  }, [socket, navigate]);

  // ---------- Answer selection ----------
  const selectAnswer = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // ---------- Navigation ----------
  const goToQuestion = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    setCurrentIndex(index);
  };

  // ---------- Submission ----------
  const handleSubmit = async () => {
    if (isSubmitting || !numericQuizId) return;

    setIsSubmitting(true);

    try {
      const payload = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        selectedOption: answer,
      }));

      const res = await quizSessionApi.submitQuiz(numericQuizId, payload);
      if (!res.success) throw new Error(res.message || "Submission failed");

      toast.success("Quiz submitted successfully.");
      navigate("/candidate/thank-you");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit quiz.");
      setIsSubmitting(false);
    }
  };

  // ---------- Helpers ----------
  const formatTime = (seconds: number | null) => {
    if (seconds === null || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // ---------- UI States ----------
  if (!quizState) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading quiz session...
      </div>
    );
  }

  if (quizState.state === "draft") {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold mb-2">Quiz Not Started Yet</h2>
        <p className="text-gray-600">Please wait for the mentor to start.</p>
      </div>
    );
  }

  if (quizState.state === "ended") {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold mb-2">Quiz Ended</h2>
        <p className="text-gray-600">Thank you for participating.</p>
      </div>
    );
  }

  // ---------- Main UI ----------
  return (
    <div className="p-6 min-h-screen bg-gray-50 relative">
      {/* Disconnected Overlay */}
      {!isConnected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Connection Lost</h3>
            <p className="text-gray-600 mb-4">
              Trying to reconnect... Please wait.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Live Quiz</h1>

          <div className="flex items-center gap-4">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                quizState.state === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {quizState.state.toUpperCase()}
            </div>

            {quizState.state === "active" && (
              <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-mono">
                ⏳ {formatTime(remainingTime)}
              </div>
            )}
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-6 mb-6">
          {currentQuestion ? (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">
                  Q{currentIndex + 1}. {currentQuestion.questionText}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map(
                  (option: string, index: number) => {
                    const selected =
                      answers[currentQuestion.id] === index;

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          selectAnswer(currentQuestion.id, index)
                        }
                        disabled={quizState.state !== "active"}
                        className={`w-full text-left p-3 rounded-lg border transition ${
                          selected
                            ? "bg-blue-100 border-blue-500"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                        } ${
                          quizState.state !== "active"
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {option}
                      </button>
                    );
                  }
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              No question available.
            </div>
          )}
        </Card>

        {/* Navigation + Submit */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            disabled={currentIndex === 0}
            onClick={() => goToQuestion(currentIndex - 1)}
          >
            ⬅ Previous
          </Button>

          <div className="text-sm text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </div>

          {currentIndex < questions.length - 1 ? (
            <Button onClick={() => goToQuestion(currentIndex + 1)}>
              Next ➡
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={isSubmitting || quizState.state !== "active"}
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
