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
            throw new Error("Failed to add questions");      }

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

export type EditQuestionsRequest = {
  questions: Array<{
    question_id?: number;
    question_text: string;
    options: Array<{
      option_id?: number;
      option_text: string;
      correct_option: boolean;
    }>;
  }>;
}
export const useEditQuestions = () => {
    const EditQuestionsRequest = async ({quizId,questions} : {quizId : string, questions : EditQuestionsRequest}) : Promise<any> => {
        if(!quizId) throw new Error("quizId is missing from route params");

        const response = await fetch(`${API_BASE_URL}/api/quiz/${quizId}/questions/edit`, {
            method : "PUT",
            headers : {
                "Content-Type" : "application/json",
                
            },
            body : JSON.stringify(questions)
        });

        if(!response.ok){
            throw new Error("Failed to edit questions"); 
        }

        return response.json();
    };

    const {
        mutateAsync :editQuestions,
        isPending,
        isError,
        isSuccess
    } = useMutation({
        mutationFn : EditQuestionsRequest
    });

    return{
        editQuestions,
        isPending,
        isError,
        isSuccess
    }
}
