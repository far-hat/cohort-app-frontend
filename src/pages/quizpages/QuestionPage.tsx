import { useNavigate, useParams } from "react-router-dom";
import {QuestionsForm,QuestionData} from "../../forms/quizforms/QuestionsForm"
import { AddQuestionsRequest, useAddQuestions } from "@/api/QuestionApi";

const QuestionPage = () => {
    const navigate = useNavigate();
    const { quizId } = useParams<{ quizId: string }>(); 

    if (!quizId) {
    return <div>Error: No quizId found in route</div>; 
  }

    const {AddQuestions,isPending} = useAddQuestions(quizId);

    const handleSave = async (data: QuestionData) => {
    
      const payload = {
      questions: data.questions.map((q) => ({
        question_text: q.question_text,
        options: q.options.map((opt) => opt.value), 
        correct_answer: q.correct_answer,
      })),
    };

  try {
    
await AddQuestions(payload);    navigate('/mentor')
  } catch (error) {
    console.error("Failed to save questions", error);
    throw error;
  }
};
    return(
        <QuestionsForm onSave={handleSave} isPending={isPending}/>
    )
}
export default QuestionPage;