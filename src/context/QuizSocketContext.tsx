import { QuizState } from "@/types/liveQuizTypes";
import { createContext, useContext } from "react";
import { Socket } from "socket.io-client"

type QuizSocketContextType = {
    socket : Socket | null;
    quizState : QuizState | null;
    isConnected : boolean;
    isLoading : boolean;
}

 export const QuizSocketContext = createContext<QuizSocketContextType | undefined> (undefined);

export const useQuizSocket = () => {
    const context = useContext(QuizSocketContext);

    if(!context){
        throw new Error(
            "UseSocket must be used in QuizSocketProvider"
        );
    }

    return context;
}

