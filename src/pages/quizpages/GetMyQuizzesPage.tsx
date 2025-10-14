import QuizListInfo from "./QuizListInfo"

import {useGetMyQuizzes} from "../../api/QuizApi"


const GetMyQuizListPage = () => {

    const {quizzes,isPending} = useGetMyQuizzes();
    
    if(isPending){
        return <div>Loading...</div>
    }
    if(!quizzes || quizzes.length == 0){
        return <span>No data found!</span>
    }
    return(
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-3">
            <div id="quiz-list"></div>
            <div id="main-content" className="flex flex-col gap-5">
                <QuizListInfo 
                quizzes = {quizzes ?? []}
                isPending={isPending}/>
            </div>
        </div>
    )
}

export default GetMyQuizListPage;