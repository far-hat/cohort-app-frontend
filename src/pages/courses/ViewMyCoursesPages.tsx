import { useGetMyCourses } from "@/api/CoursesApi"
import { getUserRoles } from "@/RoleProtectedRoutes";
import { useAuth0 } from "@auth0/auth0-react";
import { CoursesList } from "./CoursesList";

export const ViewMyCourses = () => {
    const {courses,isPending,error} = useGetMyCourses();
    const {user} = useAuth0();

    if(isPending){
        return <div>Loading...</div>
    }

    if(!courses || courses.length === 0) return <span>No data found</span>

    const role = getUserRoles(user)[0].toLowerCase();

    return(
        <div className="flex flex-col gap-5">
            <CoursesList courses={courses ?? []}  isPending = {isPending} role={role}/>
        </div>
    )
}