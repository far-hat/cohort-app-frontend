import { quizSessionApi } from "@/api/QuizSessionApi";
import { useQuizSocket } from "@/context/QuizSocketContext";
import { useEffect, useState } from "react"
import { MentorQuizControls } from "./MentorQuizControls";
import { MentorQuizDashboard } from "./MentorQuizDashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const MentorQuizSessionContent = ( {quizId} : {quizId : number})  => {

    const {socket,quizState,isConnected} = useQuizSocket();

    const [connectedCandidates, setConnectedCandidates] = useState(0);
    const[quizQuestions, setQuizQuestions] = useState<any[]> ([]);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // mentor join

    useEffect( () => {
        if(isConnected && socket){
            socket.emit("mentor_joined",{quizId});
        }
    },[isConnected,socket,quizId]);

    //fetch quiz ques
    useEffect(()=> {
        const fetchQuizData = async() => {
            const res = await fetch(`${API_BASE_URL}/api/quiz-session/${quizId}/state`);
            const data = await res.json();
            if(data.success) setQuizQuestions(data.data.questions || []);
        };

        fetchQuizData();
    },[quizId]);

    //candidate count listener
    useEffect(()=> {
        if(!socket) return;

        const joined = () => setConnectedCandidates(p => p+1);
        const submitted = () => setConnectedCandidates(p => Math.max(0,p-1));

        socket.on("candidate_joined",joined);
        socket.on("candidate_submitted",submitted);

        return()=> {
            socket.off("candidate_joined",joined);
            socket.off("candidate_submitted",submitted);
        };
    },[socket]);

    const handleStartQuiz = async () => await quizSessionApi.startQuiz(quizId);

    return (
  <div className="p-6 min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Live Quiz Session
        </h1>

        <div className="flex items-center gap-4 mt-4">
          {/* Socket Status */}
          <div
            className={`px-3 py-1 rounded-full ${
              isConnected
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isConnected ? "✅ Connected" : "❌ Disconnected"}
          </div>

          {/* Candidates */}
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            👥 {connectedCandidates} Candidates Connected
          </div>

          {/* Quiz ID */}
          <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
            Quiz ID: {quizId}
          </div>

          {/* Questions */}
          <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
            📝 {quizQuestions.length} Questions Loaded
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Controls */}
        <div className="col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">
              Quiz Controls
            </h2>

            <div className="space-y-4">
              {/* Current Status */}
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">
                  Current Status
                </h3>
                <div className="text-2xl font-bold">
                  {quizState?.state || "Not Started"}
                </div>
              </div>

              {/* Controls */}
              <MentorQuizControls
                quizId={quizId}
                quizState={quizState}
                
              />

              {/* Session Info */}
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">
                  Session Info
                </h3>

                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Total Questions:
                    </span>
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
                    <span className="text-gray-600">
                      Socket Status:
                    </span>
                    <span
                      className={`font-medium ${
                        isConnected
                          ? "text-green-600"
                          : "text-red-600"
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
              <h3 className="font-semibold">
                Share Quiz with Candidates
              </h3>
              <p className="text-sm text-gray-600">
                Share this URL with candidates to join the live quiz
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">
                Candidate Join URL:
              </div>

              <div className="font-mono text-sm bg-gray-100 p-2 rounded border">
                {window.location.origin}
                /candidate/attempt-live-quiz/{quizId}
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

}