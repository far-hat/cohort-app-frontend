export type AddQuestionsRequest = {
     questions: {
    question_text: string;
    options: string[];
    correct_answer: string;
  }[];
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