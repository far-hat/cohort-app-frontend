export const createQuizSessionApi = (request : (url : string, method? : string, body? : any) => Promise<any>) => ({
   startQuiz: (quizId: number) =>
    request(`/api/quiz-session/${quizId}/start`, "POST"),

  pauseQuiz: (quizId: number) =>
    request(`/api/quiz-session/${quizId}/pause`, "POST"),

  resumeQuiz: (quizId: number) =>
    request(`/api/quiz-session/${quizId}/resume`, "POST"),

  stopQuiz: (quizId: number,reason : string) =>
    request(`/api/quiz-session/${quizId}/stop`, "POST"),

  getQuizState: (quizId: number) =>
    request(`/api/quiz-session/${quizId}/state`, "GET"),

  joinQuiz: (quizId : number) => 
      request(`/api/quiz-session/${quizId}/join`, "POST"),

  getAttemptDetails: (attemptId: number) =>
  request(`/api/quiz-session/attempts/${attemptId}`, "GET"),

  submitAttempt: (attemptId: number,payload : object) =>
  request(`/api/quiz-session/attempts/${attemptId}/submit`, "POST"),

  getSnapshot : (quizId : number) => 
    request(`/api/quiz-session/${quizId}/snapshot`, "GET")
  
})