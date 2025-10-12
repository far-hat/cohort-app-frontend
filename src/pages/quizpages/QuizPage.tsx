import { useNavigate } from "react-router-dom";
import { QuizForm, QuizFormData } from "../../forms/quizforms/QuizForm";
import { CreateQuizRequest, useCreateMyQuiz } from "@/api/QuizApi";

const CreateQuiz = () => {
    const navigate = useNavigate();

    const { CreateQuiz , isPending} = useCreateMyQuiz();

    const handleSave = async(data:QuizFormData) => {
        const {course_name,start_date,start_time,end_date,end_time,quiz_description,status} = data;

        const toISO = (date? : Date, time? : string) => {
            if(!date) return undefined;

            const d = new Date(date);
            if(time) {
                const [h,m] = time.split(":").map(Number);
                d.setHours(h,m,0,0);
            }
            return d.toISOString();
        };

        const payload : CreateQuizRequest = {
            course_name,
            start_datetime : toISO(start_date,start_time),
            end_datetime : toISO(end_date,end_time),
            quiz_description : quiz_description || "" ,
            status : status || "",
        };

        try{
            await CreateQuiz(payload).then((quiz)=> {
                navigate(`/create-quiz/${quiz.quiz_id}/questions`)
            })
        }
        catch(error){
            console.error("Quiz creation failed",error);
        }
    }
    return(

        <QuizForm onSave={handleSave} isPending={isPending}/>
    )
}

export default CreateQuiz;