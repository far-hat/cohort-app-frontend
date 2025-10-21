import { CreateQuizRequest, Quiz, useGetQuizById, useUpdateQuizById } from "@/api/QuizApi";
import { QuizForm, QuizFormData } from "@/forms/quizforms/QuizForm";
import { useParams } from "react-router-dom";

export const QuizEditPage = () => {
  const { quizId } = useParams();
  const { quiz, isPending: isLoading } = useGetQuizById(Number(quizId));
  const { updateQuiz, isPending: isUpdating } = useUpdateQuizById();
  
  const initialData = quiz ? convertQuizToFormData(quiz) : undefined;

  const handleSave = (formData: QuizFormData) => {
    
    const quizData: CreateQuizRequest = {
      course_name: formData.course_name,
      quiz_description: formData.quiz_description || "", 
      status: formData.status || "Active",
      start_datetime: convertToISOString(formData.start_date, formData.start_time),
      end_datetime: convertToISOString(formData.end_date, formData.end_time),
    };
    
    updateQuiz({ 
      quizId: Number(quizId), 
      quizData 
    });
  };
  
  if (isLoading) return <div>Loading quiz data...</div>;
  if (!quiz) return <div>Quiz not found</div>;
  
  return (
    <QuizForm 
      onSave={handleSave}
      isPending={isUpdating}
      initialData={initialData}
      isEdit={true}
    />
  );
};


const convertToISOString = (date?: Date, time?: string): string | undefined => {
  if (!date) return undefined;
  
  const result = new Date(date);
  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    result.setHours(hours, minutes, 0, 0);
  }
  
  return result.toISOString();
};

const convertQuizToFormData = (quiz: Quiz): QuizFormData => {
  const startDate = quiz.start_datetime ? new Date(quiz.start_datetime) : undefined;
  const endDate = quiz.end_datetime ? new Date(quiz.end_datetime) : undefined;
  
  const startTime = quiz.start_datetime 
    ? new Date(quiz.start_datetime).toTimeString().slice(0, 5) 
    : "";
    
  const endTime = quiz.end_datetime 
    ? new Date(quiz.end_datetime).toTimeString().slice(0, 5) 
    : "";

  return {
    course_name: quiz.course_name || "",
    quiz_description: quiz.quiz_description || "",
    status: quiz.status || "Active",
    start_date: startDate,
    start_time: startTime,
    end_date: endDate,
    end_time: endTime,
  };
};