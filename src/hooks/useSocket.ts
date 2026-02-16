import {  createQuizSessionApi } from "@/api/QuizSessionApi";
import { QuizState } from "@/types/liveQuizTypes";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useApiClient } from "./useApiClient";
import { useAuth0 } from "@auth0/auth0-react";
import { getToken } from "@/auth/tokenManager";

export const useSocket = (quizId: number, role: "mentor" | "candidate" = "candidate") => {
  const {request}  = useApiClient();
  const {getAccessTokenSilently} = useAuth0();
  const quizSessionApi = createQuizSessionApi(request)

  const [isConnected, setIsConnected] = useState(false);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const socketRef = useRef<Socket | null>(null);

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL;

 

  // --- Fetch current quiz state ---
  const fetchCurrentState = async () => {
    try {
      console.log(`Fetching initial quiz state for Quiz ${quizId}`);
      const response = await quizSessionApi.getQuizState(quizId);

      if (!response) {
            throw new Error("No response received");
        }

      if (!response?.success || !response.data) {
        throw new Error(response?.error || "Failed to fetch quiz state");
      }
      
        const data = response.data;
        let state: QuizState;

        switch (data.session_state) {
          case 'active':
            state = {
              state: 'active',
              quizId: data.quiz_id,
              started_at: data.start_datetime,
              duration: data.duration,
              questions: data.questions,
              currentQuestionIndex: data.currentQuestionIndex,
              remainingTime: data.remainingTime,
              answers: {}
            };
            break;
          case 'paused':
            state = {
              state: 'paused',
              quizId: data.quiz_id,
              paused_at: data.paused_at,
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
              quizId: data.quiz_id,
              ended_at: data.end_datetime,
              reason : data.reason
            };
            break;
          default:
            state = {
              state: data.session_state || 'draft',
              quizId: data.quiz_id,
            };
        }

        setQuizState(state);
      
    } catch (error) {
      console.error("Failed to fetch quiz state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!quizId) return;
    // initializedRef.current = true;
    let isCancelled = false;

    const connectSocket = async () => {
      try {
        const token = await getToken(getAccessTokenSilently);
        //   {
        //   authorizationParams :  {
        //     audience :  import.meta.env.VITE_AUTH0_AUDIENCE,
        //     scope: "openid profile email read:quiz write:quiz",
        //   },
        // });

        if(isCancelled) return;

        // Cleanup any existing socket
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }

        await fetchCurrentState();

         const socket = io(SOCKET_URL, {
          transports: ["websocket", "polling"],
          withCredentials: true,
          timeout: 10000,
          auth: { token },
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("Socket connected :", socket.id);
          setIsConnected(true);

          if (role === "mentor") {
            console.log("Emitting mentor_joined for quiz :", quizId);
            socket.emit("mentor_joined", { quizId });
          } else {
            console.log("Emitting join_quiz for quiz :", quizId);
            socket.emit("join_quiz", { quizId });
          }
        });
        
        socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
          setIsConnected(false);
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected");
          setIsConnected(false);
        });

        // --- Lifecycle events ---
        socket.on("quiz:started", (payload) => {
          const state: QuizState = {
            state: "active",
            quizId: payload.quizId,
            started_at: payload.startedAt,
            duration: payload.duration,
            questions: payload.questions,
            currentQuestionIndex: payload.currentQuestionIndex,
            remainingTime: payload.duration,
            answers: {},
          };
          setQuizState(state);
        });

         socket.on("quiz:paused", (payload) => {
          setQuizState((prev) => {
            if (!prev || prev.state !== "active") return prev;
            return {
              ...prev,
              state: "paused",
              paused_at: new Date().toLocaleString(),
              remainingTime: payload.remainingTime,
            };
          });
        });

        socket.on("quiz:resumed", (payload) => {
          setQuizState((prev) => {
            if (!prev || prev.state !== "paused") return prev;
            return {
              ...prev,
              state: "active",
              currentQuestionIndex:
                payload.currentQuestionIndex ?? prev.currentQuestionIndex,
              started_at: payload.startedAt,
            };
          });
        });

        socket.on("quiz:stopped", (payload) => {
          setQuizState({
            state: "ended",
            quizId: payload.quizId,
            ended_at: payload.endedAt,
            reason: payload.reason || "mentor_stopped",
          });
        });

         socket.on("quiz:tick", (remainingSeconds) => {
          setQuizState((prev) => prev ? {
             ...prev,
              remainingTime: remainingSeconds,
          } : prev );
        });
// ============ Mentor only events ======
         if (role === "mentor") {
          socket.on("candidate_joined", (payload) =>
            console.log("Candidate joined:", payload)
          );
          socket.on("candidate_progress", (payload) =>
            console.log("Candidate progress:", payload)
          );
          socket.on("answer_saved", (payload) =>
            console.log("Candidate answer saved:", payload)
          );
          socket.on("candidate_submitted", (payload) =>
            console.log("Candidate submitted:", payload)
          );
        }

         socket.onAny((event, data) =>
          console.log(`[DEBUG] Event: ${event}`, data)
        );
} catch (error) {
        console.error("Failed to initialize socket:", error);
      }
    };

    connectSocket();

    return() => {
      isCancelled = true;
      if(socketRef.current){
        socketRef.current.emit("leave_quiz",quizId);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [quizId, SOCKET_URL, role, getAccessTokenSilently]);

  // ---------------------------
  // --- Candidate Helpers ---
  // ---------------------------
  const joinQuiz = (quizId: number) => {
    if (!socketRef.current || role !== "candidate") return;
    socketRef.current.emit("join_quiz", quizId);
  };

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
    
    role,
    // Candidate helpers
    joinQuiz,
    sendAnswer,
    navigateQuestion,
    submitQuiz,
  };
};