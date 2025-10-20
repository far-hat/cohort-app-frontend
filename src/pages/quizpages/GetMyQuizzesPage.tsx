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
        <div className="">
            <div id="main-content" >
                <QuizListInfo 
                quizzes = {quizzes ?? []}
                isPending={isPending}/>
            </div>
        </div>
    )
}

export default GetMyQuizListPage;