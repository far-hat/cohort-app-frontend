import { useMutation, useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export type CreateQuizRequest = {
    course_name : string;
    quiz_description : string;
    status: string;
    start_datetime? : string;
    end_datetime? : string;
};

export type QuizResponse = {
    quiz_id: number;
    quiz_description : string;
    status: string;
    mentor_id : number;
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

export const useGetAllQuizzes = () => {
    const getAllQuizzesRequest = async() : Promise<QuizResponse[]> => {
        const response = await fetch(`${API_BASE_URL}/api/quiz/getAll`, {
            method: "GET",
        })

        if(!response){
            throw new Error("Failed to get quizzes");
        }

        return response.json();
    };

const { data: quizzes, isPending } = useQuery<QuizResponse[], Error>(
    {
  queryKey: ["quizzes"],
  queryFn: getAllQuizzesRequest,
}
  );
    return{ quizzes,isPending}

}

