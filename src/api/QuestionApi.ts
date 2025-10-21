import { useMutation } from "@tanstack/react-query";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type AddQuestionsRequest = {
     questions: {
    question_text: string;
    options: string[];
    correct_answer: string;
  }[];
}

export const useAddQuestions = (quizId : string) => {

    const CreateQuestionRequest = async(questions : AddQuestionsRequest) : Promise< any> => {
        
        if (!quizId) throw new Error("quizId is missing from route params");

        const response = await fetch(`${API_BASE_URL}/api/quiz/${quizId}/questions/add` , {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },

            body : JSON.stringify(questions),
        });

        if(!response.ok){
            const errorText = await response.text(); 
            throw new Error(`HTTP ${response.status}: ${errorText}`);        }

        return response.json();
    };


    const {
        mutateAsync : AddQuestions,
        isPending,
        isError,isSuccess
    } = useMutation<void,Error,AddQuestionsRequest>({
        mutationFn :CreateQuestionRequest
    });

    return {
        AddQuestions,
        isPending,
        isError,
        isSuccess
    }
}

