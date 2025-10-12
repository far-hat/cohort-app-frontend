
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

type Quiz = {
  quiz_id: number;
  course_name: string;
  quiz_description : string;
  status:string;
  start_datetime?: string;
  end_datetime?: string;
  mentor_id? : number;
};

type Props = {
  quizzes: Quiz[];
  isPending: boolean
};

const QuizListInfo = ({ quizzes,isPending }: Props) => {
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

  return (
    <div className="m-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => {
        const duration = quiz.start_datetime && quiz.end_datetime
      ? `${Math.round(
          (new Date(quiz.end_datetime).getTime() - new Date(quiz.start_datetime).getTime()) /
            (1000 * 60)
        )} mins`
      : "N/A";
        return (
          <div key={quiz.quiz_id} className="font-semibold h-full flex flex-col justify-between bg-indigo-100">
            <Card>
              <CardHeader className="text-xl font-bold bg-indigo-300">
                <CardTitle>{quiz.course_name}</CardTitle>
                <CardDescription>{quiz.quiz_description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Date: {formatDateTime(quiz.start_datetime)}</p>
                <p>Mentor: {quiz.mentor_id }</p>
                <p>Starts At: {formatDateTime(quiz.start_datetime)}</p>
                <p>Ends At: {formatDateTime(quiz.end_datetime)}</p>
                <p>Status: {quiz.status}</p>
                <p>Duration: {duration}</p>
              </CardContent>
              <CardFooter>
                <button
                  onClick={() => handleClick(quiz.quiz_id)}
                  className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-blue-500"
                >
                  View Details
                </button>
              </CardFooter>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default QuizListInfo;
