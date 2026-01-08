import { useViewCohortById } from "@/api/CohortApi";
import { useParams } from "react-router-dom"
import { formatDateOnly } from "../quizpages/QuizListInfo";

export const ViewCohortByIdPage = () => {
    const {courseId,cohortId} = useParams();
    const {cohort,isPending,isSuccess,isError} = useViewCohortById(Number(courseId),Number(cohortId));

    if(!cohort) return <h3 className="text-orange-800">Oops! Cohort Not Found</h3>

    return(
        <div className="p-6">
            <header className="text-2xl font-bold">{cohort.cohort_name}</header>
            <p className="text-lg text-gray-700 mt-2">{cohort.description}</p>
            <section className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-100 rounded-lg p-4 shadow-sm">
                <span className="font-semibold">Starts On{formatDateOnly(cohort.start_date)}</span>
                <span className="font-semibold">Ends On : {cohort.end_date}</span>
            </section>
            <footer className="text-green-900">Status : {cohort.status}</footer>
        </div>
    )
}