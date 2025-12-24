import { ReactNode } from "react";
import { useSocket } from "../hooks/useSocket";
import { QuizSocketContext } from "@/context/QuizSocketContext";

type Props = {
    quizId : number;
    children : ReactNode;
}

export const QuizSocketProvider = ( {quizId, children} : Props) => {
    const socketData = useSocket(quizId);


    //useSocket(quizId only runs here)
    return(
        <QuizSocketContext.Provider value={socketData}>
            {children}
        </QuizSocketContext.Provider>
    );
};

