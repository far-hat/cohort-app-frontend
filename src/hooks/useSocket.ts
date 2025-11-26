import { QuizState } from "@/types/liveQuizTypes";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (quizId: number) => {
    const [isConnected, setIsConnected] = useState(false);
    const [quizState, setQuizState] = useState<QuizState| null>(null);
    const socketRef = useRef<Socket | null>(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   useEffect( ()=> {
    if(!quizId || !API_BASE_URL) return;

    if(socketRef.current){
        socketRef.current.disconnect();
    }

    
        socketRef.current = io(API_BASE_URL, {
            transports : ["websocket","polling"],
            withCredentials : true,
        });
    

    const socket = socketRef.current;

    //Connection
    socket.on("connect", ()=> setIsConnected(true));
    socket.on("disconnect",()=> setIsConnected(false));

    //Join Room
    socket.emit("join_quiz",quizId);

    //Server Events

    socket.on("quiz_started",(data)=> {
        console.log("QUIZ STARTED:", data);
        setQuizState(data);
    });

    socket.on("quiz_paused",(data)=> setQuizState(data));
    socket.on("quiz_resumed",(data)=> setQuizState(data));
    socket.on("quiz_ended",(data)=> setQuizState(data));

    return()=> {
        
            socket.emit("leave_quiz",quizId);
            socket.disconnect();
    };
   },[quizId, API_BASE_URL]);

   return {
    socket : socketRef.current,
    isConnected,quizState,
    send : (event : string, payload? : any) => socketRef.current?.emit(event,payload)
   }
};
