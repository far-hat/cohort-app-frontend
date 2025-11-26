import { useParams } from "react-router-dom";
import { MentorQuizControls } from "../../components/MentorQuizControls";
import { useSocket } from "@/hooks/useSocket";


export const MentorQuizSession = () => {
    const { quizId } = useParams<{ quizId: string }>();
    
    const { quizState ,isConnected} = useSocket(Number(quizId!));

    return (
    <div className="p-4">
      <h1>Quiz Live Session</h1>

      <div>Status: {quizState?.state ?? "not started"}</div>
      <div>Socket: {isConnected ? "Connected" : "Disconnected"}</div>

      <MentorQuizControls quizId={Number(quizId)} quizState={quizState} />
    </div>
  );

    

    
};