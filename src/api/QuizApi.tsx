
import { useMutation } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export type CreateQuizRequest = {
    course_name : string;
    start_datetime? : string;
    end_datetime? : string;
};

export type QuizResponse = {
    quiz_id: string;
    course_name : string;
    start_datetime? : string;
    end_datetime? : string;

}

export const useCreateMyQuiz = ()=> {

    const CreateMyQuizRequest = async ( quiz : CreateQuizRequest ) : Promise<QuizResponse> => {

    const response = await fetch(`${API_BASE_URL}/api/quiz/create` , {
        method : "POST",
         headers : {
             "Content-Type" : "application/json",
         },
         body : JSON.stringify(quiz),
     });
     if(!response.ok){
         throw new Error("Failed to create The Quiz");
     }
     return response.json();
     
};

const { mutateAsync : CreateQuiz,
    isPending,
    isError,
    isSuccess
} =useMutation<QuizResponse,Error,CreateQuizRequest>({
    mutationFn: CreateMyQuizRequest,
});

return {
    CreateQuiz,
    isPending,
    isError,
    isSuccess,
}
}

