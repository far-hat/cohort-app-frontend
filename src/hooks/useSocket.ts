import { quizSessionApi } from "@/api/QuizSessionApi";
import { QuizState } from "@/types/liveQuizTypes";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (quizId: number) => {
  const [isConnected, setIsConnected] = useState(false);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  

  const socketRef = useRef<Socket | null>(null);
  const initializedRef = useRef(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch current state from API
  const fetchCurrentState = async () => {
    try {
      console.log(`Fetching initial quiz state for Quiz ${quizId}`);
      const response = await quizSessionApi.getQuizState(quizId);
      console.log(`Initial state response`, response);

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
              questions : data.questions,
              currentQuestionIndex : data.currentQuestion,
              remainingTime : data.remainingTime
            };
            break;
          case 'paused':
            state = {
              state: 'paused',
              session_state: data.session_state,
              quizId: data.quiz_id,
              paused_at: data.start_datetime,
            };
            break;
          case 'ended':
            state = {
              state: 'ended',
              session_state: data.session_state,
              quizId: data.quiz_id,
              ended_at: data.end_datetime
            };
            break;
          case 'scheduled':
          case 'draft':
            state = {
              state: data.session_state,
              session_state: data.session_state,
              quizId: data.quiz_id
            };
            break;
          default:
            state = {
              state: 'draft',
              session_state: data.session_state,
              quizId: data.quiz_id
            };
        }

        setQuizState(state);
      }
    } catch (error) {
      console.error(`Failed to fetch quiz state:`, error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!quizId) {
      console.log("No quiz Id provided");
      return;
    }

    if(initializedRef.current){
      console.log("⚠️ useSocket already initialized, skipping");
      return;
    }

    initializedRef.current = true;

    console.log("Socket connection attempt for quiz:", quizId);

    fetchCurrentState();

    // Clean up existing socket
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Create new socket connection
    socketRef.current = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      timeout: 10000,
    });

    const socket = socketRef.current;

    // Connection events
    socket.on("connect", () => {
      console.log("✅ Connected successfully to socket server");
      setIsConnected(true);

      // Join Room
      socket.emit("join_quiz", quizId);
      console.log(`useSocket joined quiz ${quizId}`);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ useSocket: Connection error:", error);
      setIsConnected(false);
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ Socket: Disconnected, reason:", reason);
      setIsConnected(false);
    });

    // ============ Quiz Lifecycle events ============

    // Quiz started - INCLUDES QUESTIONS
    socket.on("quiz_started", (payload) => {
      console.log("📡 Quiz started payload:", payload);

      setQuizState({
        state: "active",
        session_state: "active",
        quizId: payload.quizId,
        started_at: payload.startedAt || payload.started_at,
        duration: payload.duration,
        remainingTime: payload.duration || 0,
        questions: payload.questions || [],
        currentQuestionIndex: 0,
        answers: {},
      });
    });

    // Quiz paused - preserve existing data
    socket.on("quiz_paused", (payload) => {
      console.log("📡 Quiz paused payload:", payload);

      setQuizState(prev => {
        if (!prev) {
          return {
            state: "paused",
            session_state: "paused",
            quizId: payload.quizId,
            paused_at: payload.pausedAt
          };
        }

        // Preserve questions and answers
        if (prev.state === "active") {
          return {
            ...prev,
            state: "paused",
            session_state: "paused",
            quizId: payload.quizId,
            paused_at: payload.pausedAt
          };
        }

        return {
          state: "paused",
          session_state: "paused",
          quizId: payload.quizId,
          paused_at: payload.pausedAt
        };
      });
    });

    // Quiz resumed - preserve all data
    socket.on("quiz_resumed", (payload) => {
      console.log("📡 Quiz resumed payload:", payload);

      setQuizState(( prev : any) => {
        if (!prev) {
          return {
            state: "active",
            session_state: "active",
            quizId: payload.quizId,
            resumed_at: payload.resumedAt,
            questions: [],
            currentQuestionIndex: 0,
            answers: {}
          };
        }

        // Preserve all existing data, just update state
        return {
          ...prev,
          state: "active",
          session_state: "active",
          quizId: payload.quizId,
          resumed_at: payload.resumedAt
        };
      });
    });

    // Quiz ended
    socket.on("quiz_ended", (payload) => {
      console.log("📡 Quiz ended payload:", payload);

      setQuizState({
        state: "ended",
        session_state: "ended",
        quizId: payload.quizId,
        ended_at: payload.endedAt,
        reason: payload.reason || "mentor_stopped"
      });
    });

    // Time update
    socket.on("time_update", (payload) => {
      console.log("⏰ Time update:", payload.remainingTime);

      setQuizState((prev) =>
        prev && prev.state === "active"
          ? { ...prev, remainingTime: payload.remainingTime }
          : prev
      );
    });

    // Candidate joined (mentor only)
    socket.on("candidate_joined", (payload) => {
      console.log("🎓 Candidate joined:", payload);
    });

    // Candidate progress (mentor only)
    socket.on("candidate_progress", (payload) => {
      console.log("📊 Candidate progress:", payload);
    });

    // Candidate submitted (mentor only)
    socket.on("candidate_submitted", (payload) => {
      console.log("🏁 Candidate submitted:", payload);
    });

    // Debug all events
    socket.onAny((event, data) => {
      console.log(`📡 [DEBUG] Event: ${event}`, data);
    });

    // Cleanup function
    return () => {
      console.log("🧹 useSocket: Cleaning up");

      if (socket && socket.connected) {
        socket.emit("leave_quiz", quizId);
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [quizId, API_BASE_URL]);

  return {
    socket: socketRef.current,
    isConnected,
    quizState,
    isLoading
  };
};