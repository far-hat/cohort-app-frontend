import { createQuizSessionApi } from "@/api/QuizSessionApi";
import {
    CandidateQuizState,
    MentorQuizState,
} from "@/types/liveQuizTypes";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useApiClient } from "./useApiClient";
import { useAuth0 } from "@auth0/auth0-react";
import { getToken } from "@/auth/tokenManager";
import { initCandidateSession } from "./initCandidateSession";
import { useNavigate } from "react-router-dom";
import { Snapshot } from "@/pages/quizpages/MentorQuizDashboard";

type RoleState = MentorQuizState | CandidateQuizState;

const isCandidateState = (
    state: RoleState
): state is CandidateQuizState => {
    return "attemptId" in state;
};

export const useSocket = (
    quizId: number,
    role: "mentor" | "candidate" = "candidate"
) => {
    const { request } = useApiClient();
    const { getAccessTokenSilently } = useAuth0();
    const quizSessionApi = createQuizSessionApi(request);

    const [isConnected, setIsConnected] = useState(false);
    const [quizState, setQuizState] = useState<RoleState | null>(null);
    const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [submissionResult, setSubmissionResult] = useState<any>(null);

    const socketRef = useRef<Socket | null>(null);
    const navigate = useNavigate();

    const SOCKET_URL =
        import.meta.env.VITE_SOCKET_URL ||
        import.meta.env.VITE_API_BASE_URL;

    // -------------------------------
    // Hydration
    // -------------------------------

    const hydrateMentor = async () => {
        const stateRes = await quizSessionApi.getQuizState(quizId);
        if (!stateRes?.success) throw new Error("State fetch failed");

        const snapRes = await quizSessionApi.getSnapshot(quizId);
        if (!snapRes?.success) throw new Error("Snapshot fetch failed");

        setSnapshot(snapRes.data);

        setQuizState({
            state: stateRes.data.state ?? "draft",
            quizId,
            start_datetime: stateRes.data.start_datetime,
            duration: stateRes.data.duration,
        });
    };

    const hydrateCandidate = async () => {
        const joinRes = await quizSessionApi.joinQuiz(quizId);
        if (!joinRes?.success) throw new Error("Join failed");

        const attemptId = joinRes.data.attempt_id;

        const initialState = await initCandidateSession(
            attemptId,
            quizSessionApi
        );

        setQuizState(initialState);
        return attemptId;
    };

    // -------------------------------
    // Socket Setup
    // -------------------------------

    useEffect(() => {
        if (!quizId) return;

        let cancelled = false;

        const connect = async () => {
            try {
                const token = await getToken(getAccessTokenSilently);
                if (cancelled) return;

                let attemptId: number | undefined;

                if (role === "mentor") {
                    await hydrateMentor();
                } else {
                    attemptId = await hydrateCandidate();
                }

                setIsLoading(false);

                const socket = io(SOCKET_URL, {
                    transports: ["websocket"],
                    auth: { token },
                });

                socketRef.current = socket;

                socket.on("connect", async () => {
                    setIsConnected(true);

                    if (role === "mentor") {
                        socket.emit("mentor_joined", { quizId });
                        await hydrateMentor();
                    } else {
                        socket.emit("join_quiz", { quizId, attemptId });
                    }
                });

                socket.on("disconnect", () => {
                    setIsConnected(false);
                });

                // -------------------------------
                // Lifecycle Events
                // -------------------------------

                socket.on("quiz:started", (data) => {
                    setQuizState(prev => {
                        if (!prev) return prev;

                        if (prev.state === "draft" || prev.state === "scheduled") {
                            return {
                                state: "active",
                                quizId: prev.quizId,
                                start_datetime: prev.start_datetime!,
                                duration: prev.duration!,
                                remainingTimeMs: data.remainingTime,
                            };
                        }

                        if (prev.state === "paused" || prev.state === "active") {
                            return {
                                ...prev,
                                state: "active",
                                remainingTimeMs: data.remainingTime,
                            };
                        }

                        return prev;
                    });
                });


                socket.on("quiz:paused", (data) => {
                    setQuizState(prev => {
                        if (!prev || prev.state !== "active") return prev;

                        return {
                            ...prev,
                            state: "paused",
                            remainingTimeMs: data.remainingTime,
                            paused_at: data.paused_at,
                        };
                    });
                });

                socket.on("quiz:resumed", (data) => {
                    setQuizState(prev => {
                        if (!prev || prev.state !== "paused") return prev;

                        return {
                            ...prev,
                            state: "active",
                            remainingTimeMs: data.remainingTime,
                        };
                    });
                });

                socket.on("quiz:stopped", (data) => {
                    setQuizState(prev => {
                        if (!prev) return prev;

                        return {
                            state: "ended",
                            quizId,
                            ended_at: data.ended_at,
                            reason: data.reason ?? "completed",
                        };
                    });
                });

                socket.on("quiz:tick", (data) => {
                    if (role === "mentor") {
                        //setSnapshot(data);
                        setSnapshot(prev => ({
                            ...prev,
                            ...data,
                            candidates: data.candidates || prev?.candidates || [],
                        }));
                    }
                    setQuizState(prev => {
                        if (!prev) return prev;

                        if (
                            prev.state === "active" ||
                            prev.state === "paused"
                        ) {
                            return {
                                ...prev,
                                remainingTimeMs:
                                    data.remainingSeconds * 1000,
                            };
                        }

                        return prev;
                    });
                });

                socket.on("quiz:snapshot_updated", (data) => {
                    if (role === "mentor") {
                        setSnapshot(prev => ({
                            ...prev,
                            ...data,
                            candidates: data.candidates || prev?.candidates || [],
                        }));
                    }

                    setQuizState(prev =>
                        prev
                            ? {
                                ...prev,
                                state: data.sessionState,
                                remainingTimeMs: data.remainingTime,
                            }
                            : prev
                    );
                });

                socket.on("attempt:submitted", (data) => {
                    setSubmissionResult(data);

                    setQuizState(prev =>
                        prev
                            ? {
                                state: "ended",
                                quizId,
                                ended_at: new Date().toISOString(),
                                reason: data.auto
                                    ? "auto_submitted"
                                    : "submitted",
                            }
                            : prev
                    );
                });

            } catch (err) {
                console.error("Socket init failed:", err);
                setIsLoading(false);
            }
        };

        connect();

        return () => {
            cancelled = true;

            if (socketRef.current) {
                socketRef.current.emit("leave_quiz", { quizId });
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [quizId, role, SOCKET_URL, getAccessTokenSilently]);

    // -------------------------------
    // Candidate Helpers
    // -------------------------------

    const sendAnswer = (questionId: number, optionId: number) => {
        if (
            !socketRef.current ||
            role !== "candidate" ||
            !quizState ||
            !isCandidateState(quizState)
        ) {
            return;
        }

        socketRef.current.emit("answer_saved", {
            attemptId: quizState.attemptId,
            questionId,
            optionId,
        });

        setQuizState(prev => {
            if (
                prev &&
                isCandidateState(prev) &&
                (prev.state === "active" ||
                    prev.state === "paused")
            ) {
                return {
                    ...prev,
                    answers: {
                        ...prev.answers,
                        [questionId]: optionId,
                    },
                };
            }

            return prev;
        });
    };

    const submitQuiz = () => {
        if (
            !socketRef.current ||
            role !== "candidate" ||
            !quizState ||
            !isCandidateState(quizState)
        ) {
            return;
        }

        socketRef.current.emit("candidate_submitted", {
            attemptId: quizState.attemptId,
        });

        navigate("/candidate");
    };

    return {
        socket: socketRef.current,
        isConnected,
        quizState,
        snapshot,
        isLoading,
        sendAnswer,
        submitQuiz,
    };
};
