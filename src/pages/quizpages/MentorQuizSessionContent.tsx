import { createQuizSessionApi } from "@/api/QuizSessionApi";
import { useEffect, useState } from "react";
import { MentorQuizControls } from "./MentorQuizControls";
import { MentorQuizDashboard } from "./MentorQuizDashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApiClient } from "@/hooks/useApiClient";
import { useQuizSocket } from "@/context/QuizSocketContext";

export const MentorQuizSessionContent = ({ quizId }: { quizId: number }) => {
  const { request } = useApiClient();
  const quizSessionApi = createQuizSessionApi(request);

  const { socket, quizState, isConnected } = useQuizSocket();

  const [connectedCandidates, setConnectedCandidates] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [localRemainingTime, setLocalRemainingTime] = useState<number | null>(
    null
  );

  const formatTime = (seconds?: number) => {
    if (seconds == null || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const isActive = quizState?.state === "active";
  const isPaused = quizState?.state === "paused";
  const isEnded = quizState?.state === "ended";
  const isNotStarted = !quizState || quizState.state === "draft";

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const res = await quizSessionApi.getQuizState(quizId);
        if (res.success) {
          setQuizQuestions(res.data.questions || []);
        } else {
          throw new Error("Fetch failed");
        }
      } catch (err) {
        console.error("Failed to fetch quiz state", err);
      }
    };

    fetchQuizData();
  }, [quizId]);

  // Sync timer from server
  useEffect(() => {
    if (quizState?.remainingTime != null) {
      setLocalRemainingTime(quizState.remainingTime);
    }
  }, [quizState?.remainingTime]);

  // Local countdown
  useEffect(() => {
    if (!isActive || localRemainingTime == null) return;

    const interval = setInterval(() => {
      setLocalRemainingTime(prev => {
        if (prev == null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, localRemainingTime]);

  // Candidate count listener
  useEffect(() => {
    if (!socket) return;

    const joined = () => setConnectedCandidates(p => p + 1);
    const submitted = () => setConnectedCandidates(p => Math.max(0, p - 1));

    socket.on("candidate_joined", joined);
    socket.on("candidate_submitted", submitted);

    return () => {
      socket.off("candidate_joined", joined);
      socket.off("candidate_submitted", submitted);
    };
  }, [socket]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Live Quiz Session
          </h1>

          <div className="flex items-center gap-4 mt-4">
            <div
              className={`px-3 py-1 rounded-full ${
                isConnected
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </div>

            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              👥 {connectedCandidates} Candidates Connected
            </div>

            <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
              Quiz ID: {quizId}
            </div>

            <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              {quizQuestions.length} Questions Loaded
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Controls */}
          <div className="col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Quiz Controls</h2>

              <div className="space-y-4">
                {/* Current Status */}
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Current Status</h3>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold capitalize">
                      {isNotStarted ? "Not Started" : quizState?.state}
                    </div>

                    {isActive && (
                      <div className="text-xl font-bold text-red-600">
                        {formatTime(
                          localRemainingTime ?? quizState?.remainingTime
                        )}
                      </div>
                    )}

                    {isPaused && (
                      <div className="text-sm text-yellow-700 font-semibold">
                        Paused at{" "}
                        {formatTime(
                          localRemainingTime ?? quizState?.remainingTime
                        )}
                      </div>
                    )}

                    {isEnded && (
                      <div className="text-sm text-gray-600 font-semibold">
                        Session Ended
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <MentorQuizControls quizId={quizId} quizState={quizState} />

                {/* Session Info */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Session Info</h3>

                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Questions:</span>
                      <span className="font-medium">
                        {quizQuestions.length}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Connected Candidates:
                      </span>
                      <span className="font-medium">
                        {connectedCandidates}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Socket Status:</span>
                      <span
                        className={`font-medium ${
                          isConnected ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isConnected ? "Active" : "Disconnected"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Dashboard */}
          <div className="col-span-2">
            <MentorQuizDashboard />
          </div>
        </div>

        {/* Share URL */}
        <div className="mt-8">
          <Card className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Share Quiz with Candidates</h3>
                <p className="text-sm text-gray-600">
                  Share this URL with candidates to join the live quiz
                </p>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">
                  Candidate Join URL:
                </div>

                <div className="font-mono text-sm bg-gray-100 p-2 rounded border">
                  {window.location.origin}/candidate/attempt-live-quiz/{quizId}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/candidate/attempt-live-quiz/${quizId}`
                    );
                    alert("URL copied to clipboard!");
                  }}
                >
                  📋 Copy URL
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
