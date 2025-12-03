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

export type QuizSubmission = {
    quizId: number;
    responses: Record<string, string>; 
};