import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuizSocket } from "@/context/QuizSocketContext";

export const MentorQuizDashboard = () => {
  const { socket } = useQuizSocket();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [quizTime, setQuizTime] = useState<number>(0);

  useEffect(() => {
    if (!socket) return;

    const handleCandidateJoined = (data: any) => {
      setCandidates(prev => {
        // Check if candidate already exists
        const exists = prev.find(c => c.candidateId === data.candidateId);
        if (exists) return prev;
        
        return [...prev, {
          candidateId: data.candidateId,
          candidateName: data.candidateName,
          currentQuestion: 1,
          totalQuestions: data.totalQuestions, // This should come from quiz data
          progress: 0,
          joinedAt: new Date(data.joinedAt),
          lastActivity: new Date(),
          hasSubmitted: false
        }];
      });
    };

    const handleCandidateProgress = (data: any) => {
      setCandidates(prev => prev.map(c => 
        c.candidateId === data.candidateId
          ? { 
              ...c, 
              currentQuestion: data.currentQuestionIndex,
              progress: ((data.currentQuestionIndex + 1) / data.totalQuestions) * 100,
              lastActivity: new Date(data.lastActivity)
            }
          : c
      ));
    };

    const handleCandidateSubmitted = (data: any) => {
      setCandidates(prev => prev.map(c => 
        c.candidateId === data.candidateId
          ? { ...c, hasSubmitted: true }
          : c
      ));
    };

    const handleTimeUpdate = (data: any) => {
      setQuizTime(data.remainingTime);
    };

    socket.on("candidate_joined", handleCandidateJoined);
    socket.on("candidate_progress", handleCandidateProgress);
    socket.on("candidate_submitted", handleCandidateSubmitted);
    socket.on("time_update", handleTimeUpdate);

    return () => {
      socket.off("candidate_joined", handleCandidateJoined);
      socket.off("candidate_progress", handleCandidateProgress);
      socket.off("candidate_submitted", handleCandidateSubmitted);
      socket.off("time_update", handleTimeUpdate);
    };
  }, [socket]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Live Dashboard</h2>
        <div className="text-xl font-bold">
          ⏱ {formatTime(quizTime)}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{candidates.length}</div>
          <div className="text-sm text-gray-600">Total Candidates</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-green-600">
            {candidates.filter(c => !c.hasSubmitted).length}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-yellow-600">
            {candidates.filter(c => c.hasSubmitted).length}
          </div>
          <div className="text-sm text-gray-600">Submitted</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">
            {Math.round(candidates.reduce((acc, c) => acc + c.progress, 0) / (candidates.length || 1))}%
          </div>
          <div className="text-sm text-gray-600">Avg Progress</div>
        </Card>
      </div>

      {/* Candidates List */}
      <div>
        <h3 className="font-bold mb-4">Candidate Progress</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {candidates.map(candidate => (
            <Card key={candidate.candidateId} className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">{candidate.candidateName}</div>
                    <div className={`px-2 py-1 rounded text-xs ${candidate.hasSubmitted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {candidate.hasSubmitted ? 'Submitted' : `Question ${candidate.currentQuestion}`}
                    </div>
                  </div>
                  <Progress value={candidate.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <div>Joined: {new Date(candidate.joinedAt).toLocaleTimeString()}</div>
                    <div>Last active: {new Date(candidate.lastActivity).toLocaleTimeString()}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {candidates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No candidates have joined yet. Share the quiz URL with candidates.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};   