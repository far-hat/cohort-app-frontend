import { quizSessionApi } from "../api/QuizSessionApi";

export const MentorQuizControls = ({ quizId, quizState }: any) => {
    const state = quizState?.state;

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
            {state === "scheduled" || state === "draft" && (
                <button onClick={start} className="px-4 py-2 bg-green-600 text-white rounded">Start Quiz</button>
            )}

            {state === "active" && (
                <>
                    <button onClick={pause}className="px-4 py-2 bg-yellow-500 text-white rounded">Pause Quiz</button>

                    <button onClick={stop} className="px-4 py-2 bg-red-500 text-white rounded">Stop Quiz</button>
                </>
            )}

            {state === "paused" && (
                <>
                    <button onClick={resume} className="px-4 py-2 bg-blue-600 text-white rounded">
                        Resume Quiz
                    </button>
                    <button onClick={stop} className="px-4 py-2 bg-red-600 text-white rounded">
                        Stop Quiz
                    </button>
                </>
            )}
        </div>
    );
};
