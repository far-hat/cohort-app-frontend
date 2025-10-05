import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import CreateQuiz from "./pages/quizpages/QuizPage";
import QuestionPage from "./pages/quizpages/QuestionPage";
import GetQuizListPage from "./pages/quizpages/GetQuizListPage";
import QuizDetailPage from "./pages/quizpages/QuizDetailPage";
import QuizAttemptPage from "./pages/quizpages/QuizAttemptPage";
import RoleProtectedRoutes from "./RoleProtectedRoutes";
import AdminPage from "./pages/userpages/AdminPage";
import MentorPage from "./pages/userpages/MentorPage";
import CandidatePage from "./pages/userpages/CandidatePage";
import UnauthorizedPage from "./pages/userpages/UnauthorizedPage";
const AppRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout showHero={true}>
                <HomePage />
            </Layout>
            } />
            <Route path="/auth-callback"
                element={< AuthCallbackPage />} />

            <Route path="/admin" element={<RoleProtectedRoutes allowedRoles={["Admin"]}>
                <AdminPage />
            </RoleProtectedRoutes>
            }
            />

            
            <Route path="/mentor" element={<RoleProtectedRoutes allowedRoles={["Mentor"]}>
                <MentorPage />
            </RoleProtectedRoutes>
            }
            />

            
            <Route path="/candidate" element={<RoleProtectedRoutes allowedRoles={["Candidate"]}>
                <CandidatePage />
            </RoleProtectedRoutes>
            }
            />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />

           <Route path="/create-quiz" element={
                <RoleProtectedRoutes allowedRoles={["Mentor"]}> <CreateQuiz /> </RoleProtectedRoutes>} />
            <Route path="/create-quiz/:quizId/questions" element={<RoleProtectedRoutes allowedRoles={["Mentor"]}>
                <QuestionPage />
            </RoleProtectedRoutes>} />
            <Route path="/get-quiz-list" element={<RoleProtectedRoutes allowedRoles={["Admin", "Candidate","Mentor"]}><GetQuizListPage /></RoleProtectedRoutes>} />

            <Route path="/get-quiz-list/:quizId" element={<RoleProtectedRoutes allowedRoles={["Admin"]}><QuizDetailPage /></RoleProtectedRoutes>} />

            <Route path="/get-quiz-list/quiz-page" element={<RoleProtectedRoutes allowedRoles={["Candidate","Mentor"]}> <QuizAttemptPage onSave={(data) => {
                console.log("Quiz responses:", data);
                // you could post data to server here
            }}
                isPending={false} /></RoleProtectedRoutes>}
            />
        </Routes>
    )
}

export default AppRoute;