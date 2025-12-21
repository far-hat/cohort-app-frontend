import { useCreateCohort } from "@/api/CohortApi"
import LoadingButton from "@/components/LoadingButton";
import { CreateCohortForm } from "@/forms/courseforms/CreateCohortForm";
import { createCohortType } from "@/types/courseTypes";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const CreateCohortPage = () => {
    const navigate = useNavigate();
    const {id} = useParams();

    const{CreateCohort,isPending,isError} =useCreateCohort(Number(id));

    if(isPending) return <LoadingButton />

     const handleSave = async (data : createCohortType) => {
            await CreateCohort(data);
            toast("Cohort created successfully.")
            navigate("/mentor");
        }

    return(
        <CreateCohortForm onSave={handleSave} isPending={isPending} />
    )
}