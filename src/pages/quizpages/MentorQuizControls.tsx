import { useApiClient } from "@/hooks/useApiClient";
import { createQuizSessionApi } from "../../api/QuizSessionApi";

export const MentorQuizControls = ({ quizId, quizState }: any) => {

    const currentState = quizState?.state || quizState?.session_state;

    const {request}  = useApiClient();
    const quizSessionApi = createQuizSessionApi(request)
    const start = async () => {
        await quizSessionApi.startQuiz(quizId);
    };
    const pause = async () => {
        await quizSessionApi.pauseQuiz(quizId);
    };
    const resume = async () => {
        await quizSessionApi.resumeQuiz(quizId);
    };
    const stop = async () => {
        await quizSessionApi.stopQuiz(quizId);
    };

    return (
        <div className="flex gap-3 mt-4">
            {(currentState === "scheduled" || currentState === "draft" || currentState === "ended") && (
                <button onClick={start} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Start Quiz</button>
            )}


            {currentState === "active" && (
                <>
                    <button onClick={pause} className="px-4 py-2 bg-yellow-500 text-white rounded">Pause Quiz</button>

                    <button onClick={stop} className="px-4 py-2 bg-red-500 text-white rounded">Stop Quiz</button>
                </>
            )}

            {currentState === "paused" && (
                <>
                    <button onClick={resume} className="px-4 py-2 bg-blue-600 text-white rounded">
                        Resume Quiz
                    </button>
                    <button onClick={stop} className="px-4 py-2 bg-red-600 text-white rounded">
                        Stop Quiz
                    </button>
                </>
            )}

            {
                currentState === "resumed" &&(
                    <>
                    <button onClick={pause} className="px-4 py-2 bg-yellow-600 text-white rounded">
                        Pause Quiz
                    </button>
                    <button onClick={stop} className="px-4 py-2 bg-red-600 text-white rounded">
                        Stop Quiz
                    </button>
                </>
                )
            }

            {!currentState && (
                <div className="text-gray-500">Loading quiz state...</div>
            )}
        </div>
    );
};
