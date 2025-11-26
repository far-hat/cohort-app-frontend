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
    // Waiting for quiz to start
    | {
          state: "waiting";
          started_at?: string;
          duration?: number;
      }
    // A question is being displayed
    | {
          state: "question";
          question: LiveQuestion;
          started_at?: string;
          duration?: number;
      }
    // Quiz paused
    | {
          state: "paused";
          paused_at?: string;
          started_at?: string;
          duration?: number;
      }
    // Quiz finished
    | {
          state: "finished";
          ended_at?: string;
          started_at?: string;
          duration?: number;
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
