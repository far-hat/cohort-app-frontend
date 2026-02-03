import { useApiClient } from "@/hooks/useApiClient";
import { createQuizSessionApi } from "@/api/QuizSessionApi";
import { useState } from "react";
import { toast } from "sonner";

export const MentorQuizControls = ({ quizId, quizState }: any) => {
  const { request } = useApiClient();
  const quizSessionApi = createQuizSessionApi(request);
  const [loading, setLoading] = useState(false);

  const currentState = quizState?.state || "unknown";

  const safeCall = async (action: () => Promise<any>, successMsg: string) => {
    try {
      setLoading(true);
      await action();
      toast.success(successMsg);
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = () => {
    switch (currentState) {
      case "active":
        return "🟢 Quiz is currently active. You can pause or stop it.";
      case "paused":
        return "⏸️ Quiz is paused. You can resume or stop it.";
      case "ended":
        return "🏁 Quiz has ended. You may start it again.";
      case "draft":
      case "scheduled":
        return "🕒 Quiz is ready to be started.";
      default:
        return "ℹ️ Quiz state unknown. Please refresh.";
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-700 bg-gray-100 p-3 rounded">
        {renderMessage()}
      </div>

      <div className="flex gap-3 flex-wrap">
        {(currentState === "draft" ||
          currentState === "scheduled" ||
          currentState === "ended") && (
          <button
            disabled={loading}
            onClick={() =>
              safeCall(() => quizSessionApi.startQuiz(quizId), "Quiz started")
            }
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Start Quiz
          </button>
        )}

        {currentState === "active" && (
          <>
            <button
              disabled={loading}
              onClick={() =>
                safeCall(() => quizSessionApi.pauseQuiz(quizId), "Quiz paused")
              }
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
            >
              Pause Quiz
            </button>

            <button
              disabled={loading}
              onClick={() =>
                safeCall(
                  () => quizSessionApi.stopQuiz(quizId, "mentor_stopped"),
                  "Quiz stopped"
                )
              }
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Stop Quiz
            </button>
          </>
        )}

        {currentState === "paused" && (
          <>
            <button
              disabled={loading}
              onClick={() =>
                safeCall(() => quizSessionApi.resumeQuiz(quizId), "Quiz resumed")
              }
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Resume Quiz
            </button>

            <button
              disabled={loading}
              onClick={() =>
                safeCall(
                  () => quizSessionApi.stopQuiz(quizId, "mentor_stopped"),
                  "Quiz stopped"
                )
              }
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Stop Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
};
