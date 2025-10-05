import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const CandidatePage = () => {
    const navigate = useNavigate();
    return (
         <DashboardLayout>
            <div className="p-8 space-y-8">
             <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                <h1 className="font-bold text 3xl mb-2">Welcome Candidate</h1>
                <p className="font-semibold">View available courses, quizzes and result </p>
             </div>
            <div className="flex justify-cente gap-6">
                <button className="px-6 py-2 bg-green-800 text-white rounded-hover" >View Courses</button>
                <button className="px-6 py-2 bg-green-800 text-white rounded-hover" onClick={()=> navigate("/get-quiz-list")}>View Quizzes</button>
                <button className="px-6 py-2 bg-green-800 text-white rounded-hover" >View Results</button>
            </div>
         </div>
         </DashboardLayout>
    )
}
export default CandidatePage;