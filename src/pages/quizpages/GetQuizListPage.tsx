import QuizListInfo from "./QuizListInfo"
import quizzes from "../../mockdata/quizzes.json"




const GetQuizListPage = () => {
    if(!quizzes){
        <span>No data found!</span>
    }
    return(
        <div className="grid grid-cols-1 lg-grid-cols[250px_1fr gap-3]">
            <div id="quiz-list"></div>
            <div id="main-content" className="flex flex-col gap-5">
                <QuizListInfo isPending={false}/>
            </div>
        </div>
    )
}

export default GetQuizListPage