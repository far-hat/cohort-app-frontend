import { z } from "zod";

// Form schema + type
export const attemptSchema = z.object({
    answer: z.string().nonempty("Please select an answer")
});
export type AttemptForm = z.infer<typeof attemptSchema>;

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
};

// Quiz state
export type QuizState =
    | {
          state: "active";          // start/resume
          quizId: number;
          started_at?: string;      // quiz_started
          resumedAt?: string;       // quiz_resumed
          duration?: number;
      }
    | {
          state: "paused";          // quiz_paused
          quizId: number;
          pausedAt: string;
      }
    | {
          state: "ended";           // quiz_ended
          quizId: number;
          endedAt: string;
      };

// Returned by useSocket
export type UseSocketState = {
    socket: any;            // OR Socket from socket.io-client
    isConnected: boolean;
    quizState: QuizState | null;
};

// Summarized quiz returned by API
export type QuizSummary = {
    quiz_id: number;
    course_name: string;
};
