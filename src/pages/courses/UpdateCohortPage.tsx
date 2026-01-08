import { useUpdateCohort } from "@/api/CohortApi";
import LoadingButton from "@/components/LoadingButton";
import { CreateCohortForm } from "@/forms/courseforms/CreateCohortForm";
import { createCohortType } from "@/types/courseTypes";
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner";

export const UpdateCohortPage = () => {
    const navigate = useNavigate();

    const {courseId,cohortId} = useParams();

    const {UpdateCohort,isPending,isError,isSuccess} = useUpdateCohort(Number(courseId),Number(cohortId));

    const handleSave = async (data : createCohortType) => {
        await UpdateCohort(data);
        if(isSuccess){
            toast("Cohort updated successfully");
            navigate("/mentor");
        }
        if(isError) return <h2 className="text-orange-800">Oops!!</h2>
    }

    return(
        <CreateCohortForm onSave={handleSave} isPending={isPending} isEditing={true}/>
    )


}