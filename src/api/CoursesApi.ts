import { Course, createCourseType } from "@/types/courseTypes";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "@tanstack/react-query";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateCourse = () => {
    const {getAccessTokenSilently} = useAuth0();
    const user = useAuth0();

    const CreateCourseRequest = async( course : createCourseType) : Promise <any> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/course/create` , {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${accessToken}`
            },
            body : JSON.stringify(course),
        });
        if(!response.ok){
            throw new Error("failed to create Course");
        }

        return response.json();
    };

    const {
        mutateAsync : CreateCourse,
        isPending,
        isError,
        isSuccess
    }= useMutation<any,Error,createCourseType>({
        mutationFn : CreateCourseRequest,

    });

    return{
        CreateCourse,
        isPending,
        isError,
        isSuccess
    }
}

export const useGetMyCourses = () => {

    const {getAccessTokenSilently} = useAuth0();

    const getMyCoursesRequest = async() : Promise<Course[]> =>{

        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/course/view`,{
        method: "GET",
        headers: {
            Authorization : `Bearer ${accessToken}`
        }
    });

    if(!response){
        throw new Error("Failed to fetch courses");
    }

    return response.json();
    }

    const {data : courses , isPending,error } = useQuery<Course[],Error> ({
        queryKey : ["my_courses"],
        queryFn : getMyCoursesRequest,
    });

    return{
        courses,
        isPending,
        error,
    }
}