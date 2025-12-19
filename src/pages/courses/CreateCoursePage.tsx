import { useCreateCourse } from "@/api/CoursesApi";
import { CourseForm } from "@/forms/courseforms/CreateCourse";
import { createCourseType } from "@/types/courseTypes";
import { useNavigate } from "react-router-dom"

const CreateCourse = () => {
    const navigate = useNavigate();
    const {CreateCourse,isPending} = useCreateCourse();

    const handleSave = async (data : createCourseType) => {
        await CreateCourse(data);
        navigate("/mentor");
    }

    return(
            <CourseForm onSave={handleSave} isPending={isPending}/>
        )

}

export default CreateCourse;