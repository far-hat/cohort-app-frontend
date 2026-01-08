import { useGetCourseById } from "@/api/CoursesApi";
import LoadingButton from "@/components/LoadingButton";
import { useNavigate, useParams } from "react-router-dom"
import { formatDateOnly } from "../quizpages/QuizListInfo";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";



export const CourseDetailPage = () => {
    const { id } = useParams();
    const { course, isPending, error } = useGetCourseById(Number(id));

    const navigate = useNavigate();

const handleViewClick = (id:string)=>{
    navigate(`/mentor/courses/${course?.course_id}/view-cohort/${id}`);
}
const handleCreateCohort = (id : string) => {
    navigate(`/mentor/courses/${id}/create-cohort`);
}

const handleUpdateCohort = (cohortId : string) => {
    navigate(`/mentor/courses/${course?.course_id}/update-cohort/${cohortId}`)
}

    if (isPending) return <LoadingButton />

    if (!course) return <span>Course not found!</span>

    return (
        <main className="p-1">
            <header className="bg-gray-100 rounded-lg p-6 mb-6">
                <h1 className="text-3xl font-bold">{course.course_title}</h1>
                <p className="text-lg text-gray-700 mt-2">
                    {course.description}
                </p>
            </header>

            <section className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-100 rounded-lg p-4 shadow-sm">
                <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold">{course.status.toUpperCase()}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-semibold">{formatDateOnly(course.created_at)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Cohorts</p>
                    <p className="font-semibold">{course.cohorts.length}</p>
                </div>
            </section>

            <section className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Cohorts</h2>

                    <Button className="bg-blue-700 hover:bg-blue-500 text-white"
                    onClick={()=>handleCreateCohort(course.course_id)}> + Create Cohort</Button>
                </div>

                {course.cohorts.map((cohort) => (
                    <Card key={cohort.cohort_id} className="hover:shadow-lg transition bg-indigo-50">
                        <CardHeader className="font-semibold text-lg">
                            {cohort.cohort_name}
                        </CardHeader>

                        <CardContent className="text-sm text-gray-700">
                            <p>Status: {cohort.status.toUpperCase()}</p>
                            <p>Starts: {formatDateOnly(cohort.start_date)}</p>
                            <p>Ends: {formatDateOnly(cohort.end_date)}</p>
                        </CardContent>

                        <CardFooter className="flex gap-2">
                            <Button size="sm" variant="outline"
                            onClick={()=>handleViewClick(cohort.cohort_id)}>View</Button>
                            <Button size="sm" variant="outline" onClick={()=> handleUpdateCohort(cohort.cohort_id)}>Update</Button>
                        </CardFooter>
                    </Card>

                ))}
            </section>

        </main>
    )
}