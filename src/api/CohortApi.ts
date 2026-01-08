import { Cohort, createCohortType } from "@/types/courseTypes";
import { useAuth0 } from "@auth0/auth0-react"
import { useMutation, useQuery } from "@tanstack/react-query";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const useCreateCohort = (id:number) => {

    const {getAccessTokenSilently} = useAuth0();

    const createCohortRequest = async(cohort : createCohortType) : Promise<any> => {

        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/course/${id}/create`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${accessToken}`
            },
            body : JSON.stringify(cohort)
        });

        if(!response.ok)  throw new Error("Failed to create Cohort");

        return response.json();
    };

    const {
        mutateAsync : CreateCohort,
        isPending,
        isError,
        isSuccess
    } = useMutation<any,Error,createCohortType>({
        mutationFn : createCohortRequest,
    });

    return{
        CreateCohort,
        isPending,
        isSuccess,
        isError
    }
    
}

export const useUpdateCohort = (courseId : number, cohortId : number) => {

    const {getAccessTokenSilently} = useAuth0();

    const updateCohortRequest = async (cohort : createCohortType) : Promise<any> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/course/${courseId}/update/${cohortId}`, {
            method : "PUT",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${accessToken}`
            },
            body : JSON.stringify(cohort)
        });

        if(!response.ok) throw new Error("Failed to update cohort");

        return response.json();
    }

    const {
        mutateAsync :UpdateCohort,
        isPending,
        isError,
        isSuccess
    } = useMutation <any,Error,createCohortType> ({
        mutationFn : updateCohortRequest
    });

    return{
        UpdateCohort,
        isPending,
        isSuccess,
        isError
    }
}

export const useViewCohortById = (courseId : number,cohortId : number) => {

    const {getAccessTokenSilently} = useAuth0();

    const viewCohortByIdRequest = async ():Promise<Cohort> => {
        
        const accessToken = getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/course/${courseId}/view/${cohortId}`,{
            method : "GET",
            headers : {
                Authorization : `Bearer ${accessToken}`
            },

        });

        if(!response.ok) throw new Error ("Failed to fetch Cohort details");
        console.log(response);
        return response.json();
    };

    const { data : cohort , isPending,isSuccess,isError} = useQuery<Cohort,Error> ({
        queryKey : ["cohort",cohortId],
        queryFn : viewCohortByIdRequest,
        enabled : !!cohortId
    });

    return { cohort,isPending,isSuccess,isError}
}