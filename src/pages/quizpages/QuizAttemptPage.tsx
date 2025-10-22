import { useNavigate, useParams } from "react-router-dom";
import {QuizAttemptForm} from "../../forms/quizforms/QuizAttemptForm";
import { useSubmitQuizAttempt } from "@/api/QuizApi"; 
const QuizAttemptPage = () => {
    const { quizId } = useParams();
    const { submitQuiz, isPending } = useSubmitQuizAttempt(); 
    const navigate = useNavigate();
    const handleSave = async (quizData: any) => {
        try {
            await submitQuiz({
                quizId: Number(quizId),
                responses: quizData
            });
            //console.log(`Quiz Response ${quizData}`);
            
            navigate(`/candidate`)
        } catch (error) {
            console.error("Failed to submit quiz:", error);
        }
    };

    return (
        <QuizAttemptForm
            onSave={handleSave}
            isPending={isPending}
        />
        
    );
};

export default QuizAttemptPage;