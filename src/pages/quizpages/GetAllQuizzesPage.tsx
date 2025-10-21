import QuizListInfo from "./QuizListInfo"

import {useGetAllQuizzes} from "../../api/QuizApi"
import { useAuth0 } from "@auth0/auth0-react";


const GetQuizListPage = () => {
const { user } = useAuth0();
    const roles = user?.["http://localhost:5173/roles"] || [];
    const role = roles.includes("Admin") ? "admin" : 
                roles.includes("Mentor") ? "mentor" :
                roles.includes("Candidate")?"candidate" : "guest";  
    const {quizzes,isPending} = useGetAllQuizzes();
    if(!quizzes || quizzes.length ==0){
        <span>No data found!</span>
    }
    return(
        <div className="grid grid-cols-1 lg-grid-cols[250px_1fr gap-3]">
            <div id="main-content" className="flex flex-col gap-5">
                <QuizListInfo 
                quizzes = {quizzes ?? []}
                isPending={isPending}
                role={role}/>
            </div>
        </div>
    )
}

export default GetQuizListPage;