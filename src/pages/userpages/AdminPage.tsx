import { useState } from "react";
import GetQuizListPage from "../quizpages/GetAllQuizzesPage";
import MentorsList from "./MentorsList";
import CandidatesList from "./CandidatesList";
import Layout from "@/layouts/Layout";

const AdminPage = ()=> {
    const [activeSession,setActiveSession] = useState<"quizzes" | "mentors" | "candidates" | null>(null);
    return (
        <Layout >
            <div className="p-8 space-y-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold mb-2"> Welcome Admin </h1>
                <p className="text-gray-700"> Manage quizzes,view mentors and oversee candidates.</p>
            </div>
            
            <div className="flex justify-cente gap-6">
                <button className="px-6 py-2 bg-green-800 text-white rounded-hover" onClick={()=> setActiveSession("quizzes")}>View Quizzes</button>

                <button className="px-6 py-2 bg-blue-800 text-white rounded-hover" onClick={()=> setActiveSession("mentors")}>View Mentors</button>

                <button className="px-6 py-2 bg-purple-800 text-white rounded-hover" onClick={()=> setActiveSession("candidates")}>View Candidates</button>
            </div>

            <div className="mt-6">
                {activeSession === "quizzes" && <GetQuizListPage/>}

                {activeSession === "mentors" && <MentorsList/>}

                {activeSession === "candidates" && <CandidatesList/>}
            </div>
        </div>
        </Layout>
    )
}
export default AdminPage;