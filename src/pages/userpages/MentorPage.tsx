import Layout from "../../layouts/Layout";
import { SideBar } from "@/components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const MentorPage = () => {
    return (
        <Layout>
            <div className="min-h-screen flex">
                
                <div className="flex-shrink-0">
                    <SideBar role={"Mentor"} />
                </div>
                
               
                <div className="flex-1 p-8 bg-gray-50">
                   
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Mentor</h1>
                        <p className="text-xl text-gray-600 mb-4">Create quizzes, view quizzes.</p>
                       
                    </div>

                   
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <Outlet /> 
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MentorPage;