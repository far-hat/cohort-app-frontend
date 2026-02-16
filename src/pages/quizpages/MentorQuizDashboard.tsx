interface Candidate { 
  attemptId: number; 
  candidateId: number; 
  name: string; state: 
  string; score: number; 
  progressPercent: number; 
  joinedAt: string | null; 
  submittedAt: string | null; 
} 
export interface Snapshot { 
  sessionState: string; 
  remainingTime: number; 
  totalCandidates: number; 
  candidates: Candidate[]; }
export const MentorQuizDashboard = ({
  snapshot,
}: {
  snapshot?: Snapshot | null;
}) => {
  if (!snapshot) return <div>Loading snapshot...</div>;

  const candidates = snapshot.candidates || [];

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Live Candidates
        </h2>
        <span className="text-sm text-gray-500">
          Total: {snapshot.totalCandidates}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b text-sm text-gray-500">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Progress</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.attemptId} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-medium text-gray-800">{candidate.name}</td>
                <td className="py-3 px-4 w-64">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${candidate.progressPercent}%` }}
                    />
                  </div>
                </td>
                <td className="py-3 px-4">
                  {candidate.state === "submitted" ? (
                    <span className="text-green-600 font-medium">Submitted</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">In Progress</span>
                  )}
                </td>
                <td className="py-3 px-4">{candidate.state === "submitted" ? candidate.score : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
