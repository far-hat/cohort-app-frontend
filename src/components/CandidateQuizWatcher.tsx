import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CandidateWatcherProps } from "@/types/liveQuizTypes";



export const CandidateQuizWatcher = ({ quizzes }: CandidateWatcherProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        const activeQuiz = quizzes.find(q => q.status === "Active");

        if (activeQuiz) {
            toast.success("Your quiz has started!");
            const timer = setTimeout(() => {
                navigate(`/candidate/attempt-live-quiz/${activeQuiz.quiz_id}`);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [quizzes, navigate]);

    return null; // This component only listens for quiz state
};
