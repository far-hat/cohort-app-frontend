import {  createQuizSessionApi } from "@/api/QuizSessionApi";
import { QuizState } from "@/types/liveQuizTypes";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useApiClient } from "./useApiClient";

export const useSocket = (quizId: number, role: "mentor" | "candidate" = "candidate") => {
  const {request}  = useApiClient();
  const quizSessionApi = createQuizSessionApi(request)
  const [isConnected, setIsConnected] = useState(false);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const initializedRef = useRef(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // --- Fetch current quiz state ---
  const fetchCurrentState = async () => {
    try {
      console.log(`Fetching initial quiz state for Quiz ${quizId}`);
      const response = await quizSessionApi.getQuizState(quizId);

      if (response.success && response.data) {
        const data = response.data;
        let state: QuizState;

        switch (data.session_state) {
          case 'active':
            state = {
              state: 'active',
              session_state: data.session_state,
              quizId: data.quiz_id,
              started_at: data.start_datetime,
              duration: data.duration,
              questions: data.questions,
              currentQuestionIndex: data.currentQuestion,
              remainingTime: data.remainingTime,
              answers: {}
            };
            break;
          case 'paused':
            state = {
              state: 'paused',
              session_state: 'paused',
              quizId: data.quiz_id,
              paused_at: data.start_datetime,
              currentQuestionIndex : data.currentQuestionIndex,
              remainingTime : data.remainingTime,
              answers : data.answers,
              duration : data.duration,
              questions : data.questions
            };
            break;
          case 'ended':
            state = {
              state: 'ended',
              session_state: 'ended',
              quizId: data.quiz_id,
              ended_at: data.end_datetime,
              reason : data.reason
            };
            break;
          default:
            state = {
              state: data.session_state || 'draft',
              session_state: data.session_state || 'draft',
              quizId: data.quiz_id,
            };
        }
      if (quizState?.state === "active" && data.session_state === "active") return;

        setQuizState(state);
      }
    } catch (error) {
      console.error("Failed to fetch quiz state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!quizId || initializedRef.current) return;
    initializedRef.current = true;

    fetchCurrentState();

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      if (role === "mentor") socket.emit("mentor_joined", { quizId });
      else socket.emit("join_quiz", { quizId });
    });

    socket.on("connect_error", (error) => setIsConnected(false));
    socket.on("disconnect", () => setIsConnected(false));

    // --- Lifecycle events ---
    socket.on("quiz_started", (payload) => {
      const state : QuizState= {
        state : "active",
        session_state : "active",
        quizId : payload.quizId,
        started_at : payload.startedAt,
        duration : payload.duration,
        questions : payload.questions,
        currentQuestionIndex : 0,
        remainingTime : payload.duration,
        answers : {}
      }
      setQuizState(state);
    });

    socket.on("quiz_paused", (payload) => {
      setQuizState( prev => {
        if(!prev || prev.state !== "active")  return prev;
        return {
          ...prev,
          state: "paused",
          session_state : "paused",
          quizId: prev.quizId,
          paused_at: new Date().toLocaleString(),
          currentQuestionIndex: prev.currentQuestionIndex,
          remainingTime: payload.remainingTime,
          answers: prev.answers,
          duration : prev.duration,
          questions : prev.questions 
  }
       })
    });

    socket.on("quiz_resumed", (payload) => {
      setQuizState( prev =>{
        if(!prev || prev.state !== "paused") return prev;
        return {
          ...prev,
          state : "active",
          session_state : "active",
          currentQuestionIndex : payload.currentQuestionIndex ?? prev.currentQuestionIndex,
          started_at : new Date().toLocaleString(),

        }
      })
    });

    socket.on("quiz_ended", (payload) => {
      setQuizState({ state: "ended", session_state: "ended", quizId: payload.quizId, ended_at: payload.endedAt, reason: payload.reason || "mentor_stopped" });
    });

    socket.on("time_update", (payload) => {
      
      setQuizState( prev => {
        if(!prev || prev.state !== "active") return prev;
        return {...prev,remainingTime : payload.remainingTime}
      })
      
    });

    if (role === "mentor") {
      socket.on("candidate_joined", (payload) => console.log("🎓 Candidate joined:", payload));
      socket.on("candidate_progress", (payload) => console.log("📊 Candidate progress:", payload));
      socket.on("answer_saved", (payload) => console.log("💾 Candidate answer saved:", payload));
      socket.on("candidate_submitted", (payload) => console.log("🏁 Candidate submitted:", payload));
    }

    socket.onAny((event, data) => console.log(`[DEBUG] Event: ${event}`, data));

    return () => {
      if (socket.connected) {
        socket.emit("leave_quiz", quizId);
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [quizId, API_BASE_URL, role]);

  // ---------------------------
  // --- Candidate Helpers ---
  // ---------------------------
  const sendAnswer = (questionId: number, answer: string) => {
    if (!socketRef.current || role !== "candidate") return;
    socketRef.current.emit("answer_saved", { quizId, questionId, answer });

    // Update local state optimistically
    setQuizState(prev => {
      if (!prev || prev.state !== "active") return prev;
      return {
        ...prev,
        answers: { ...prev.answers, [questionId]: answer },
      };
    });
  };

  const navigateQuestion = (questionIndex: number) => {
    if (!socketRef.current || role !== "candidate") return;
    socketRef.current.emit("candidate_navigated", { quizId, questionIndex });
    setQuizState(prev => prev ? { ...prev, currentQuestionIndex: questionIndex } : prev);
  };

  const submitQuiz = () => {
    if (!socketRef.current || role !== "candidate") return;
    socketRef.current.emit("candidate_submitted", { quizId });
  };

  return {
    socket: socketRef.current,
    isConnected,
    quizState,
    isLoading,
    // Candidate helpers
    sendAnswer,
    navigateQuestion,
    submitQuiz,
  };
};