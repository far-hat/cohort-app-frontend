import { Cohort, createCohortType } from "@/types/courseTypes";
import { useAuth0 } from "@auth0/auth0-react"
import { useMutation } from "@tanstack/react-query";
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