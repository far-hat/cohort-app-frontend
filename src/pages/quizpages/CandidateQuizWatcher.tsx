import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CandidateWatcherProps } from "@/types/liveQuizTypes";



export const CandidateQuizWatcher = ({ quizzes }: CandidateWatcherProps) => {
    const navigate = useNavigate();
    const [redirected,setRedirected] = useState(false);

    useEffect(() => {
        // Only redirect once per session
        if (redirected) return;

        // Don't redirect if already on quiz page
        if (window.location.pathname.includes("/attempt-")) return;

        const activeQuiz = quizzes.find(q => q.status === "Active");

        if (activeQuiz) {
            setRedirected(true);
            navigate(`/candidate/attempt-live-quiz/${activeQuiz.quiz_id}`);
                    }
    }, [quizzes, navigate,redirected]);

    return null; 
};
