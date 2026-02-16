import { ReactNode } from "react";
import { useSocket } from "../hooks/useSocketHook";
import { QuizSocketContext } from "@/context/QuizSocketContext";

type Props = {
    quizId : number;
    role : "mentor" | "candidate";
    children : ReactNode;
}

export const QuizSocketProvider = ({ quizId, role, children }: Props) => {
  const socketData = useSocket(quizId, role);
  return <QuizSocketContext.Provider value={socketData}>{children}</QuizSocketContext.Provider>;
};


