import QuizListInfo from "./QuizListInfo"

import {useGetAllQuizzes,type QuizResponse} from "../../api/QuizApi"


const GetQuizListPage = () => {

    const {quizzes,isPending} = useGetAllQuizzes();
    if(!quizzes || quizzes.length ==0){
        <span>No data found!</span>
    }
    return(
        <div className="grid grid-cols-1 lg-grid-cols[250px_1fr gap-3]">
            <div id="quiz-list"></div>
            <div id="main-content" className="flex flex-col gap-5">
                <QuizListInfo 
                quizzes = {quizzes ?? []}
                isPending={isPending}/>
            </div>
        </div>
    )
}

export default GetQuizListPage