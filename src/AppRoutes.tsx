import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import CreateQuiz from "./pages/quizpages/QuizPage";
import QuestionPage from "./pages/quizpages/QuestionPage";
import GetQuizListPage from "./pages/quizpages/GetAllQuizzesPage";
import QuizDetailPage from "./pages/quizpages/QuizDetailPage";
import QuizAttempt from "./pages/quizpages/QuizAttemptPage";
import RoleProtectedRoutes from "./RoleProtectedRoutes";
import AdminPage from "./pages/userpages/AdminPage";
import MentorPage from "./pages/userpages/MentorPage";
import CandidatePage from "./pages/userpages/CandidatePage";
import UnauthorizedPage from "./pages/userpages/UnauthorizedPage";
import GetMyQuizListPage from "./pages/quizpages/GetMyQuizzesPage";
import { CoursesMenu } from "./components/CoursesMenu";
import { MentorHomeContent } from "./pages/userpages/MentorHomeContent";
import { QuizEditPage } from "./pages/quizpages/QuizEditPage";
import { CandidateHomeContent } from "./pages/userpages/CandidateHomeContext";
import QuizAttemptPage from "./pages/quizpages/QuizAttemptPage";
import { CandidateRegistrationForm, MentorRegistrationForm } from "./forms/userforms/UserProfileForm";
import EditQuestionsPage from "./pages/quizpages/QuestionEditPage";
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


            <Route path="/mentor" element={
                <RoleProtectedRoutes allowedRoles={["Mentor"]}>
                    <MentorPage />
                </RoleProtectedRoutes>
            }>

                <Route index element={<MentorHomeContent />} />
                <Route path="profile" element={<MentorRegistrationForm/>}/>
                <Route path="quizzes" element={<GetMyQuizListPage />} />
                <Route path="courses" element={<CoursesMenu />} />
                <Route path="create-quiz" element={<CreateQuiz />} />
                <Route path="create-quiz/:quizId/questions" element={<QuestionPage />} />
                <Route path="quizpage/:quizId" element={<QuizDetailPage />} />  
                <Route path="edit-quiz/:quizId" element={<QuizEditPage />} /> 
                <Route path="edit-quiz/:quizId/questions" element={<EditQuestionsPage />} />            
            </Route>


            <Route path="/candidate" element={ 
                <RoleProtectedRoutes allowedRoles={["Candidate"]}>
                <CandidatePage />
            </RoleProtectedRoutes>
            }>
                <Route index element={<CandidateHomeContent />} />
                <Route path="courses" element={<CoursesMenu/>}/>
                <Route path="quizzes" element={<GetQuizListPage/>} />
                <Route path="attempt-quiz/:quizId" element={<QuizAttemptPage/>}/>
                <Route path="profile" element={<CandidateRegistrationForm/>}/>
            </Route>
           

            <Route path="/unauthorized" element={<UnauthorizedPage />} />


            <Route path="/get-quiz-list" element={<RoleProtectedRoutes allowedRoles={["Admin", "Candidate", "Mentor"]}><GetQuizListPage /></RoleProtectedRoutes>} />

            <Route path="/get-quiz-list/:quizId" element={<RoleProtectedRoutes allowedRoles={["Admin"]}><QuizDetailPage /></RoleProtectedRoutes>} />

            
        </Routes>
    )
}

export default AppRoute;