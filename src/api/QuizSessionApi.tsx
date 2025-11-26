const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const request = async(url : string, method : string = "GET") => {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers : {"Content-Type" : "application/json"},
  });

  if(!res.ok){
    const error = await res.json().catch( ()=> ({message : "Error fetching"}));
    throw new Error(error.message || "Request failed");
  }

  return res.json();

}

export const quizSessionApi = {
    startQuiz : (quizId : number) => request(`/api/quiz-session/${quizId}/start`, "POST"),

    pauseQuiz : (quizId : number) => request(`/api/quiz-session/${quizId}/pause`, "POST"),

    resumeQuiz : (quizId : number) => request(`/api/quiz-session/${quizId}/resume`, "POST"),

    stopQuiz : (quizId : number) => request(`/api/quiz-session/${quizId}/stop`, "POST"),

    getQuizState  : (quizId : number) => request(`/api/quiz-session/${quizId}/start`, "GET"),

  }