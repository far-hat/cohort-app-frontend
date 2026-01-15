export const createQuizSessionApi = (request : (url : string, method? : string, body? : any) => Promise<any>) => ({
   startQuiz: (quizId: number) =>
    request(`/api/quiz-session/${quizId}/start`, "POST"),

  pauseQuiz: (quizId: number) =>
    request(`/api/quiz-session/${quizId}/pause`, "POST"),

  resumeQuiz: (quizId: number) =>
    request(`/api/quiz-session/${quizId}/resume`, "POST"),

  stopQuiz: (quizId: number) =>
    request(`/api/quiz-session/${quizId}/stop`, "POST"),

  getQuizState: (quizId: number) =>
    request(`/api/quiz-session/${quizId}/state`, "GET"),
})