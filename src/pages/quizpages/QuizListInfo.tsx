import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDeleteQuizById } from "@/api/QuizApi";

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
  role: string;
};

const QuizListInfo = ({ quizzes, isPending, role }: Props) => {
  const navigate = useNavigate();
  const { deleteQuiz, isPending: isDeleting } = useDeleteQuizById();

  if (isPending) {
    return <span>Loading...</span>;
  }

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

  const handleCreateQuiz = () => {
    navigate("/mentor/create-quiz");
  }

  const handleViewClick = (quizId: number) => {
    if (role === "mentor") {
      navigate(`/mentor/quizpage/${quizId}`)
    } else {
      navigate(`/candidate/quizpage/${quizId}`);
    }
  }

  const handleDeleteClick = async (quizId: number) => {
    if (role === "mentor") {
      try {
        await deleteQuiz(quizId);
        navigate(`/mentor`);
      } catch (error) {
        console.log("Error deleting quiz", error);
      }
    }
  }

  const handleAttemptClick = (quizId: number) => {
    navigate(`/candidate/attempt-quiz/${quizId}`);
  }

  const handleEditClick = (quizId: number) => {
    navigate(`/mentor/edit-quiz/${quizId}`);
  }

  return (
    <div className="m-4">
      {role === "mentor" && (
        <div className="sticky top-0 bg-white py-4 z-10 border-b">
          <Button
            onClick={handleCreateQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Quiz
          </Button>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-2xl font-bold">
          {role === "mentor" ? "My Quizzes" : "Available Quizzes"}
        </h2>
      </div>

      <div className="rounded-md border w-full">
        <Table className="w-full">
          <TableHeader className="bg-gray-50">
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
                  <TableCell className="font-semibold">{quiz.course_name}</TableCell>
                  <TableCell className="font-semibold">{quiz.quiz_description}</TableCell>
                  <TableCell className="font-semibold">{formatDateOnly(quiz.start_datetime)}</TableCell>
                  <TableCell className="font-semibold">{formatTimeOnly(quiz.start_datetime)}</TableCell>
                  <TableCell className="font-semibold">{duration}</TableCell>
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
                      {role === "mentor" ? (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleViewClick(quiz.quiz_id)}>
                            View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditClick(quiz.quiz_id)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(quiz.quiz_id)}>
                            Delete
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleAttemptClick(quiz.quiz_id)}
                          disabled={quiz.status !== 'Active'}
                        >
                          Attempt Quiz
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {isDeleting && <div className="mt-4 text-center">Deletion in process...</div>}
    </div>
  );
};

export default QuizListInfo;