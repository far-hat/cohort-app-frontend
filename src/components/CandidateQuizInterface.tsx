import { useSocket } from "@/hooks/useSocket";
import { RealTimeQuizAttempt } from "@/pages/quizpages/CandidateLiveQuizAttempt";
import { useParams } from "react-router-dom";

export const CandidateQuizInterface = () => {
  const { quizId } = useParams<{ quizId: string }>();

  const { quizState, isConnected } = useSocket(Number(quizId));

  return (
    <div className="p-4">
      <h2>Candidate Quiz Interface</h2>

      <div>Status: {quizState?.state ?? "waiting"}</div>
      <div>Socket: {isConnected ? "connected" : "disconnected"}</div>
      <RealTimeQuizAttempt/>
    </div>
  );
};
