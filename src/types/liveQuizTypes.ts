import { z } from "zod";

// Form schema + type
export const attemptSchema = z.object({
    answer: z.string().nonempty("Please select an answer")
});
export type AttemptForm = z.infer<typeof attemptSchema>;

export type QuizForWatcher = {
    quiz_id: number;
    status: string;
};

export type CandidateWatcherProps = {
    quizzes: QuizForWatcher[];
};
// Question option
export type LiveQuestionOption = {
    option_id: number;
    option_text: string;
};

// Question
export type LiveQuestion = {
    question_id: number;
    question_text: string;
    options: LiveQuestionOption[];
    total_questions : number;
    question_number : number;
};

export type QuizQuestion = {
    question_id : number;
    question_text : string;
    options : Array<{
        option_id : number;
        option_text : string;
    }>;
    question_number : number;
    total_questions : number;
};

export type CandidateQuizState = {
    state : "waiting" | "active" | "ended" | "paused";
    quizId : number;
    duration : number;
    remainingTime : number;
    currentQuestion : QuizQuestion;
    totalQuestions : number;
    answers : Record<number,string>;
    canNavigate : boolean;
}

// Quiz state
export type QuizState =
        {
            state : "waiting";
            quizId : number;
            message : string;
        } 
    | {
          state : "active"
          session_state: string;          // start/resume
          quizId: number;
          started_at?: string;      // quiz_started
          resumed_at?: string;       // quiz_resumed
          duration?: number;
          remainingTime : number;
          questions : LiveQuestion[];
          currentQuestionIndex : number;
          answers? : Record<number,string>;
      }
    | {
          session_state : string;
          state: "paused";          // quiz_paused
          quizId: number;
          paused_at: string;
      }
    | {
          state: "ended"; 
          session_state : string;          // quiz_ended
          quizId: number;
          ended_at: string;
          reason? : "time_up" | "mentor_stopped" | "submitted";
      }
      
    | {
      state: "question";  
      quizId: number;
      question: LiveQuestion;
    }
  |{
          state: "scheduled" | "draft";  
          session_state?: string;
          quizId: number;
      };

export type CandidateProgress ={
    candidateId : string;
    candidateName : string;
    currentQuestion : number;
    totalQuestions : number;
    progress : number;
    lastActivity : Date;
    hasSubmitted? : boolean;
}
// Returned by useSocket
export type UseSocketState = {
    socket: any;            // OR Socket from socket.io-client
    isConnected: boolean;
    quizState: QuizState;
};

// Summarized quiz returned by API
export type QuizSummary = {
    quiz_id: number;
    course_name: string;
};
