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

export type MentorQuizState =
  | {
      state: "draft" | "scheduled";
      quizId: number;
      start_datetime?: string;
      duration?: number;
    }
  | {
      state: "active";
      quizId: number;
      start_datetime: string;
      duration: number;
      remainingTimeMs: number;
    }
  | {
      state: "paused";
      quizId: number;
      start_datetime: string;
      paused_at: string;
      duration: number;
      remainingTimeMs: number;
    }
  | {
      state: "ended";
      quizId: number;
      ended_at: string;
      reason: string;
    };





export type CandidateQuizState =
  | {
      state: "draft" | "scheduled";
      attemptId?: number;
      quizId: number;
      start_datetime?: string;
      duration?: number;
    }
  | {
      state: "active";
      quizId: number;
      start_datetime: string;
      duration: number;
      remainingTimeMs: number;
      questions: Question[];
      answers: Record<number, number>;
      attemptId: number;
    }
  | {
      state: "paused";
      quizId: number;
      start_datetime: string;
      paused_at: string;
      duration: number;
      remainingTimeMs: number;
      questions: Question[];
      answers: Record<number, number>;
      attemptId: number;
    }
  | {
      state: "ended";
      attemptId?: number;
      quizId: number;
      ended_at: string;
      reason: string;
    };

// ----------------------------
// Quiz State Union
// ----------------------------
export type QuizState =
  | {
      state: "draft" | "scheduled";
      attemptId? : number;
      quizId: number;
      start_datetime?: string;
      duration?: number;
    }
  | {
      state: "active";
      quizId: number;
      start_datetime: string;
      duration: number;
      remainingTimeMs: number;   // from snapshot
      questions: Question[];
      answers: Record<number, number>; // questionId -> optionId
      attemptId: number;
    }
  | {
      state: "paused";
      quizId: number;
      start_datetime: string;
      paused_at: string;
      duration: number;
      remainingTimeMs: number;
      questions: Question[];
      answers: Record<number, number>;
      attemptId: number;
    }
  | {
      state: "ended";
      attemptId? : number;
      quizId: number;
      ended_at: string;
      reason: string;
    };



export type CandidateProgress = {
  candidateId: string;
  candidateName: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;              
  lastActivity: string;
  joinedAt? : string;
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
