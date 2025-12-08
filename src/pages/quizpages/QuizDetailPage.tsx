import { useNavigate, useParams } from "react-router-dom";
import { useGetQuizById } from "@/api/QuizApi";

const QuizDetailPage = () => {
    const { quizId } = useParams();
    const { quiz, isPending} = useGetQuizById(Number(quizId));

    const navigate = useNavigate();
    if(isPending) return <div>Loading</div>

    

    if(!quiz) return <div>Quiz not found</div>

   
    return (
        
        <div className="p-6">
            <h1 className="text-2xl font-bold">{quiz.course_name}</h1>
            <p>{quiz.quiz_description}</p>

            {
                quiz?.questions?.map( (question) => (
                    <div key={question.question_id} className="border p-4 my-4">
                        <h3 className="font semibold">{question.question_text}</h3>
                        <ul className="list-disc ml-6">
                            {question.options.map( (option)=> (
                                <li key={option.option_id} className= {option.correct_option ? "text-green-600 font-bold" : ""}>
                                    {option.option_text} {option.correct_option && "✓"}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            }
        </div>
    );
}
export default QuizDetailPage;