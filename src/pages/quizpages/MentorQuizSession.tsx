import { useParams } from "react-router-dom";
import { QuizSocketProvider } from "@/context/QuizSocketProvider";
import MentorQuizSessionContent  from "./MentorQuizSessionContent";

export const MentorQuizSession = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const numericQuizId = Number(quizId);
  
  return(
    <QuizSocketProvider quizId={numericQuizId} role="mentor">
        <MentorQuizSessionContent quizId={numericQuizId}/>
    </QuizSocketProvider>
  )
};