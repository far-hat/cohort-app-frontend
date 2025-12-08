import { quizSessionApi } from "@/api/QuizSessionApi";
import { QuizState } from "@/types/liveQuizTypes";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (quizId: number) => {

    const [isConnected, setIsConnected] = useState(false);
    const [quizState, setQuizState] = useState<QuizState| null>(null);
    const [isLoading,setIsLoading] = useState(true);

    const socketRef = useRef<Socket | null>(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    //fetch current state from API

    const fetchCurrentState = async () => {
        try {
            console.log(`Fetching initial quiz state for Quiz ${quizId}`);
            const response = await quizSessionApi.getQuizState(quizId);
            console.log(`Initial state response `,response);

            if(response.success && response.data){
                const data = response.data;
                let state : QuizState;

                switch(data.session_state) {
                    case 'active' : 
                        state = {
                            state : 'active',
                            session_state : data.session_state,
                            quizId : data.quiz_id,
                            started_at : data.start_datetime,
                            duration : data.duration,
                        };
                        break;
                    case 'paused' : 
                        state = {
                            state : 'paused',
                            session_state : data.session_state,
                            quizId : data.quiz_id,
                            paused_at : data.start_datetime,
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
             console.error(` Failed to fetch quiz state:`, error);
        }finally{
            setIsLoading(false);
        }
    }
    
   useEffect( ()=> {
    if(!quizId) { 
        console.log("No quiz Id provided ");
        return
    };
    console.log("Socket connection attempt for quiz:", quizId);

    fetchCurrentState();

    if(socketRef.current){
        socketRef.current.disconnect();
    }

    
    socketRef.current = io(API_BASE_URL, {
            transports : ["websocket","polling"],
            withCredentials : true,
            timeout : 10000,
        });
    

    const socket = socketRef.current;

    //Connection
    socket.on("connect", ()=> {
        console.log("Connected successfully");
        setIsConnected(true);

        //Join Room
        socket.emit("join_quiz",quizId);
        console.log(`useSocket joined quiz ${quizId}`);

        });

        socket.on("connect_error", (error) => {
            console.error(" useSocket: Connection error:", error);
            setIsConnected(false);
        });

        socket.on("disconnect",(reason)=> {
            console.log("useSocket: Disconnected, reason:", reason)
            setIsConnected(false)
        });

    

    //Server Events

    

     socket.on("quiz_started", (payload) => {
            setQuizState({
                state: "active",
                session_state : "active",
                quizId: payload.quizId,
                started_at: payload.started_at,
                duration: payload.duration
            });
        });

        socket.on("quiz_paused", (payload) => {
            setQuizState({
                state : "paused",
                session_state: "paused",
                quizId: payload.quizId,
                paused_at: payload.pausedAt
            });
        });

        socket.on("quiz_resumed", (payload) => {
            setQuizState({
                state : "active",
                session_state: "active",
                quizId: payload.quizId,
                resumed_at: payload.resumedAt
            });
        });

        socket.on("quiz_ended", (payload) => {
            setQuizState({
                state : "ended",
                session_state: "ended",
                quizId: payload.quizId,
                ended_at: payload.endedAt
            });
        });

    return()=> {
            console.log("UseSocket : Cleaning up");
            socket.emit("leave_quiz",quizId);
            socket.disconnect();
    };
   },[quizId,API_BASE_URL]);

   return {
    socket : socketRef.current,
    isConnected,
    quizState,
    isLoading
   }
};
