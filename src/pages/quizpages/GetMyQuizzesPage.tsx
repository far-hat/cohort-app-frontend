import QuizListInfo from "./QuizListInfo"

import {useGetMyQuizzes} from "../../api/QuizApi"
import { useAuth0 } from "@auth0/auth0-react";


const GetMyQuizListPage = () => {

    const {quizzes,isPending} = useGetMyQuizzes();
    const {user} = useAuth0();

    const roles = user?.["http://localhost:5173/roles"] || [];
    const role = roles.includes("Admin") ? "admin" : 
                roles.includes("Mentor") ? "mentor" :
                roles.includes("Candidate")?"candidate" : "guest";

    if(isPending){
        return <div>Loading...</div>
    }
    if(!quizzes || quizzes.length == 0){
        return <span>No data found!</span>
    }
    return(
        <div className="">
            <div id="main-content" className="flex flex-col gap-5">

                <QuizListInfo 
                quizzes = {quizzes ?? []}
                isPending={isPending}
                role={role}/>
            </div>
        </div>
    )
}

export default GetMyQuizListPage;