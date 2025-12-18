import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "@/hooks/useSocket";
import { MentorQuizDashboard } from "@/pages/quizpages/MentorQuizDashboard";
import { MentorQuizControls } from "@/pages/quizpages/MentorQuizControls";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quizSessionApi } from "@/api/QuizSessionApi";

export const MentorQuizSession = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const numericQuizId = Number(quizId);
  
  const { quizState, isConnected, socket } = useSocket(numericQuizId);
  const [connectedCandidates, setConnectedCandidates] = useState<number>(0);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Join as mentor when connected
  useEffect(() => {
    if (isConnected && socket && quizId) {
      console.log("👨‍🏫 Joining as mentor...");
      socket.emit("join_quiz", numericQuizId);
      socket.emit("mentor_joined", { quizId: numericQuizId });
    }
  }, [isConnected, socket, quizId]);

  // Fetch quiz questions when component mounts
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // Fetch quiz details including questions
        const response = await fetch(`${API_BASE_URL}/api/quiz-session/${quizId}/state`);
        const data = await response.json();
        if (data.success) {
          setQuizQuestions(data.questions || []);
        }
      } catch (error) {
        console.error("Failed to fetch quiz questions:", error);
      }
    };

    if (quizId) {
      fetchQuizData();
    }
  }, [quizId]);

  // Listen for candidate connections
  useEffect(() => {
    if (!socket) return;

    const handleCandidateJoined = (data: any) => {
      console.log("🎓 Candidate joined:", data);
      setConnectedCandidates(prev => prev + 1);
    };

    const handleCandidateProgress = (data: any) => {
      console.log("📊 Candidate progress:", data);
    };

    const handleCandidateSubmitted = (data: any) => {
      console.log("🏁 Candidate submitted:", data);
      setConnectedCandidates(prev => Math.max(0, prev - 1));
    };

    socket.on("candidate_joined", handleCandidateJoined);
    socket.on("candidate_progress", handleCandidateProgress);
    socket.on("candidate_submitted", handleCandidateSubmitted);

    return () => {
      socket.off("candidate_joined", handleCandidateJoined);
      socket.off("candidate_progress", handleCandidateProgress);
      socket.off("candidate_submitted", handleCandidateSubmitted);
    };
  }, [socket]);

  // Start quiz with all questions
  const handleStartQuiz = async () => {
    try {
      // 1. Start quiz via API
      const startResponse = await quizSessionApi.startQuiz(numericQuizId);
      console.log("Quiz started:", startResponse);

      // 2. After quiz is started in DB, broadcast to candidates via socket
      if (socket && quizQuestions.length > 0) {
        // Get quiz duration from the API response or from quiz data
        const quizDuration = 30; // Default 30 minutes - you should get this from startResponse
        
        // Emit event to start quiz for candidates
        socket.emit("mentor_start_quiz", {
          quizId: numericQuizId,
          duration: quizDuration * 60, // Convert to seconds
          questions:startResponse.data.questions
        });
        
        console.log(`🚀 Quiz ${quizId} started for candidates with ${quizQuestions.length} questions`);
      }
    } catch (error: any) {
      console.error("Failed to start quiz:", error);
      alert("Failed to start quiz: " + (error.message || "Unknown error"));
    }
  };

  

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Live Quiz Session</h1>
          <div className="flex items-center gap-4 mt-4">
            <div className={`px-3 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isConnected ? '✅ Connected' : '❌ Disconnected'}
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              👥 {connectedCandidates} Candidates Connected
            </div>
            <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
              Quiz ID: {quizId}
            </div>
            <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              📝 {quizQuestions.length} Questions Loaded
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Quiz Controls */}
          <div className="col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Quiz Controls</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Current Status</h3>
                  <div className="text-2xl font-bold">
                    {quizState?.state || "Not Started"}
                  </div>
                </div>

                <MentorQuizControls 
                  quizId={numericQuizId} 
                  quizState={quizState}
                  onStartQuiz={handleStartQuiz}
                />

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Session Info</h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Questions:</span>
                      <span className="font-medium">{quizQuestions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-6 00">Connected Candidates:</span>
                      <span className="font-medium">{connectedCandidates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Socket Status:</span>
                      <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                        {isConnected ? 'Active' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Middle: Live Dashboard */}
          <div className="col-span-2">
            <MentorQuizDashboard quizId={numericQuizId} />
          </div>
        </div>

        {/* Quiz URL for Candidates */}
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
                <div className="text-sm text-gray-500 mb-1">Candidate Join URL:</div>
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