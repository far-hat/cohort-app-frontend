import quizzes from "../../mockdata/quizzes.json";
import mentors from "../../mockdata/mentors.json";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

type Props = {
  isPending: boolean
};

const QuizListInfo = ({ isPending }: Props) => {
  const { user } = useAuth0();
  const navigate = useNavigate();

  if (isPending) {
    return <span>Loading...</span>;
  }

  const handleClick = (quizId: string) => {
    const roles = user?.["http://localhost:5173/roles"] || [];

    if (roles.includes("Admin") || roles.includes("Mentor")) {
      navigate(`/get-quiz-list/${quizId}`);
    } else if (roles.includes("Candidate")) {
      navigate(`/get-quiz-list/${quizId}/quiz-page`);
    } else {
      navigate("/unauthorized");
    }
  };

  return (
    <div className="flex flex-row gap-4">
      {quizzes.map((quiz) => {
        const mentor = mentors.find(m => m.mentor_id === quiz.mentor_id);

        return (
          <div key={quiz.quiz_id} className="text-xl font-bold">
            <Card>
              <CardHeader>
                <CardTitle>{quiz.course_title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Date: {quiz.quiz_date}</p>
                <p>Mentor: {mentor ? mentor.name : "Unknown"}</p>
                <p>Starts At: {quiz.start_time}</p>
                <p>Ends At: {quiz.end_time}</p>
                <p>Status: {quiz.status}</p>
                <p>Duration: {quiz.duration}</p>
              </CardContent>
              <CardFooter>
                <button
                  onClick={() => handleClick(quiz.quiz_id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
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
