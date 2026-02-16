import { useEffect, useRef, useState } from "react";
import { MentorQuizControls } from "./MentorQuizControls";
import { MentorQuizDashboard } from "./MentorQuizDashboard";
import { useQuizSocket } from "@/context/QuizSocketContext";

type Props = {
  quizId: number;
};

const formatTime = (ms?: number) => {
  if (!ms) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export default function MentorQuizSessionContent({ quizId }: Props) {
  const { snapshot } = useQuizSocket();

  // Local timer state
  const [localTime, setLocalTime] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  // Sync localTime whenever snapshot updates
  useEffect(() => {
    if (!snapshot) return;

    // Set timer to snapshot time
    setLocalTime(snapshot.remainingTime ?? 0);

    // Clear any previous interval
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only tick if quiz is active
    if (snapshot.sessionState === "active") {
      intervalRef.current = window.setInterval(() => {
        setLocalTime(prev => Math.max(prev - 1000, 0));
      }, 1000);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [snapshot?.remainingTime, snapshot?.sessionState]);

  // Show loading screen if snapshot is not yet available
  if (!snapshot) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading session...
      </div>
    );
  }

  // Safe values with fallback
  const sessionState = snapshot.sessionState ?? "draft";
  const candidates = snapshot.candidates ?? [];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Mentor Session
            </h1>
            <p className="text-sm text-gray-500 capitalize">
              Status: {sessionState}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Time Remaining</p>
            <p className="text-3xl font-bold text-indigo-600">
              {formatTime(localTime)}
            </p>
          </div>
        </div>

        {/* Controls */}
        <MentorQuizControls quizId={quizId} sessionState={sessionState} />

        {/* Dashboard */}
        <MentorQuizDashboard
          snapshot={{
            ...snapshot,
            candidates, // ensure candidates is always an array
            sessionState,
          }}
        />
      </div>
    </div>
  );
}
