import {  useEditQuestions } from "@/api/QuestionApi";
import { useGetQuizById } from "@/api/QuizApi";
import { QuestionsForm , QuestionData} from "@/forms/quizforms/QuestionsForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";


const EditQuestionsPage = () => {
    const navigate = useNavigate();
    const {quizId } = useParams<{quizId : string}>();

    if(!quizId){
        return <div>Error: No quizId found in route</div>
    }

    const { quiz , isPending } = useGetQuizById(Number(quizId));

    const { editQuestions, isPending: isEditPending } = useEditQuestions();

    const transformQuestionsToFormData = ( quizData : any ) : QuestionData => {
        if (!quizData?.questions) {
            return { questions: [] };
        }
        return {
            questions : quizData.questions.map( (q : any) => ({
                question_id : q.question_id,
                question_text : q.question_text,
                options : q.options.map( (o:any)=> ({
                    option_id : o.option_id,             
                    value : o.option_text
                })),
                correct_answer : q.options.find( (opt : any) => opt.correct_option?.option_text ),
            })),
        };
    };
    const handleSave = async(data : QuestionData) => {
        const payload = {
           questions : data.questions.map( (q,index) => {
            const originalQuestion = quiz?.questions?.[index];

            return{
                question_id : originalQuestion?.question_id ,
                question_text : q.question_text,
                options : q.options.map((opt,optIndex) =>{
                    const originalOption = originalQuestion?.options?.[optIndex];
                    return{
                        option_id : originalOption?.option_id ,
                        option_text : opt.value,
                        correct_option : q.correct_answer === opt.value
                    };
                } ),
            };
           }),
        };
        try {
            await editQuestions({quizId, questions:payload});
            toast.success("Questions updated successfully");
            navigate('/mentor');
        } catch (error) {
            console.error("Failed to update questions",error);
            toast.error("Failed to update questions");
        }
    };
    if(isPending){
        return <div>Loading Questions</div>
    }
    return(
        <QuestionsForm 
            onSave={handleSave}
            isPending={isEditPending}
            initialData={quiz ? transformQuestionsToFormData(quiz): undefined}
            isEdit={true}
            />
    )
}
export default EditQuestionsPage;