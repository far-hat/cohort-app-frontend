import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Quiz = {
  quiz_id: number;
  course_name: string;
  quiz_description: string;
  status: string;
  start_datetime?: string;
  end_datetime?: string;
  mentor_id?: number;
};

type Props = {
  quizzes: Quiz[];
  isPending: boolean;
};

const QuizListInfo = ({ quizzes, isPending }: Props) => {
  const { user } = useAuth0();
  const navigate = useNavigate();

  if (isPending) {
    return <span>Loading...</span>;
  }

  const handleClick = (quizId: number) => {
    const roles = user?.["http://localhost:5173/roles"] || [];

    if (roles.includes("Admin") || roles.includes("Mentor")) {
      navigate(`/get-quiz-list/${quizId}`);
    } else if (roles.includes("Candidate")) {
      navigate(`/get-quiz-list/${quizId}/quiz-page`);
    } else {
      navigate("/unauthorized");
    }
  };

  const formatDateTime = (isoDate?: string) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: true,
    });
  };

  const formatDateOnly = (isoDate?: string) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-IN", {
      dateStyle: "medium",
    });
  };

  const formatTimeOnly = (isoDate?: string) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return date.toLocaleTimeString("en-IN", {
      timeStyle: "short",
      hour12: true,
    });
  };
  const handleCreateQuiz = () =>{
    navigate("/mentor/create-quiz");
  }

  const handleViewClick = (quizId : number) => {
    navigate(`/mentor/quizpage/${quizId}`)
  }

  return (
    <div className="m-4">

      <div className="sticky top-0 bg-white py-4 z-10 border-b">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">My Quizzes</h2>
      <Button 
        onClick={handleCreateQuiz}
        className="bg-blue-500 hover:bg-blue-400"
      >
        Create Quiz
      </Button>
    </div>
  </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader >
            <TableRow>
              <TableHead className="font-bold">Quiz Name</TableHead>
              <TableHead className="font-bold">Quiz Description</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Starts At</TableHead>
              <TableHead className="font-bold">Duration</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.map((quiz) => {
              const duration = quiz.start_datetime && quiz.end_datetime
                ? `${Math.round(
                    (new Date(quiz.end_datetime).getTime() - new Date(quiz.start_datetime).getTime()) /
                    (1000 * 60)
                  )} mins`
                : "N/A";

              return (
                <TableRow key={quiz.quiz_id} className="hover:bg-gray-100">
                  <TableCell className="font-medium">{quiz.course_name}</TableCell>
                  <TableCell>{quiz.quiz_description}</TableCell>
                  <TableCell>{formatDateOnly(quiz.start_datetime)}</TableCell>
                  <TableCell>{formatTimeOnly(quiz.start_datetime)}</TableCell>
                  <TableCell>{duration}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quiz.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {quiz.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={()=>handleViewClick(quiz.quiz_id)}>View</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="destructive">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QuizListInfo;