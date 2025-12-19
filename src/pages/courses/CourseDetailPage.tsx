import { useGetCourseById } from "@/api/CoursesApi";
import LoadingButton from "@/components/LoadingButton";
import { useParams } from "react-router-dom"

export const CourseDetailPage = () => {
    const {id} = useParams();
    const {course,isPending,error} = useGetCourseById(Number(id));

    if(isPending) return <LoadingButton/>

    if(!course) return <span>Course not found!</span>
    
    return(
        <div className="p-6">
            <h1 className="text-2xl font-bold">{course.course_title}</h1>
            <p className="text-xl font-semibold">{course.description}</p>
        </div>
    )
}