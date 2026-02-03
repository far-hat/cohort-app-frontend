import { QuizSocketProvider } from "@/context/QuizSocketProvider"
import { CandidateQuizInterface } from "./CandidateQuizInterface"
import { useParams } from "react-router-dom";

export const CandidateQuizSession = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const numericQuizId = Number(quizId);


    return (
        <QuizSocketProvider quizId={numericQuizId}>
            <CandidateQuizInterface/>
        </QuizSocketProvider>
    )
}