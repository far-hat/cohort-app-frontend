import QuizAttemptPage from "@/pages/quizpages/QuizAttemptPage";
import { useAuth0 } from "@auth0/auth0-react";
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

export type Quiz= {
    quiz_id: number;
    quiz_description : string;
    status: string;
    mentor_id : number;
    course_name : string;
    start_datetime? : string;
    end_datetime? : string;
    questions? : Question[]
}

export type Question = {
    question_id : number;
    question_text : string;
    quiz_id : number;
    options : Options[]
}

export type Options = {
    option_id : number;
    option_text : string;
    correct_option : boolean;
    question_id : number
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
        });

        if(!response){
            throw new Error("Failed to get quizzes");
        }

        return response.json();
    };

const { data: quizzes, isPending } = useQuery<QuizResponse[], Error>(
    {
  queryKey: ["all-quizzes"],
  queryFn: getAllQuizzesRequest,
}
  );
    return{ quizzes,isPending}

}


export const useGetMyQuizzes = () => {
    const {getAccessTokenSilently} = useAuth0();
    const getMyQuizzesRequest = async() : Promise<QuizResponse[]> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/quiz/my_quizzes` , {
            method : "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if(!response){
            throw new Error("Failed to get quizzes");
        }

        return response.json();
    };

    const { data : quizzes , isPending ,error} = useQuery<QuizResponse [] , Error> ( {
        queryKey : ["my-quizzes"],
        queryFn : getMyQuizzesRequest,
    });

    return {
        quizzes,
        isPending,
        error
    }
}

export const useGetQuizById = (quizId : number) => {
    const getQuizByIdRequest = async() :Promise<Quiz> => {
        const response = await fetch(`${API_BASE_URL}/api/quiz/view-quiz/${quizId}`, {
            method : "GET",
            headers : {
                "Content-Type" : "applicaation/json",
            }
        })
        if(!response) {
                throw new Error("Failed to get Quiz");
            }
        return response.json();
    };

    const { data : quiz , isPending} = useQuery<Quiz,Error> ({
        queryKey : ["quiz",quizId],
        queryFn : getQuizByIdRequest,
        enabled : !!quizId
    });

    return{quiz,isPending,Error};
}
