
import { SideBar } from "@/components/sidebar/Sidebar";
import Layout from "@/layouts/Layout";
import { Outlet, useNavigate } from "react-router-dom";

const CandidatePage = () => {
    return (
         <Layout>
            <div className="min-h-screen flex">
             <div className="flex-shrink-0">
                                 <SideBar role={"Candidate"} />
                             </div>
            <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Candidate</h1>
                        <p className="text-xl text-gray-600 mb-4">View available Courses and Register Course of your choice.View and attempt quizzes.</p>
                        <Outlet /> 
                    </div>

                   
                    
         </div>
         </Layout>
    )
}
export default CandidatePage;