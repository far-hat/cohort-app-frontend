import { z } from "zod";
import { Question } from "./quizTypes";
import { Socket } from "socket.io-client";

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



// ----------------------------
// Quiz State Union
// ----------------------------
export type QuizState =
  | {
      state: "draft" | "waiting" | "scheduled";
      quizId: number;
      message?: string;
      remainingTime?: number;
    }
  | {
      state: "active";
      quizId: number;
      started_at: string;          // ISO string
      duration: number;           // total duration in seconds/minutes
      questions: Question[];
      currentQuestionIndex: number;
      remainingTime: number;
      answers: Record<number, string>;
    }
  | {
      state: "paused";
      quizId: number;
      paused_at: string;          // ISO string
      duration: number;
      questions: Question[];
      currentQuestionIndex: number;
      remainingTime: number;
      answers: Record<number, string>;
    }
  | {
      state: "ended";
      quizId: number;
      ended_at: string;           // ISO string
      reason: string;
      remainingTime?: number;
    };


export type CandidateProgress = {
  candidateId: string;
  candidateName: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;              // percentage (0–100)
  lastActivity: Date;
  hasSubmitted?: boolean;
}

// Returned by useSocket
export type UseSocketState = {
  socket: Socket | null;
  isConnected: boolean;
  quizState: QuizState | null;
  isLoading: boolean;
  sendAnswer: (questionId: number, answer: string) => void;
  navigateQuestion: (questionIndex: number) => void;
  submitQuiz: () => void;
};
// Summarized quiz returned by API
export type QuizSummary = {
    quiz_id: number;
    course_name: string;
};
