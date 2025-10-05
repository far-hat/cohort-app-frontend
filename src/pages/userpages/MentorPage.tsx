import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const MentorPage = () => {
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <div className="p-10 space-y-8">

            <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold mb-2"> Welcome Mentor </h1>
                <p className="text-gray-700"> Create quizzes,view quizzes.</p>
            </div>
            <div className="flex justify-center gap-6">
                <button
                    className="px-6 py-2 bg-green-800 text-white rounded hover:bg-green-900"
                    onClick={() => navigate("/get-quiz-list")}
                >
                    View Quizzes
                </button>
                <button
                    className="px-6 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
                    onClick={() => navigate("/create-quiz")}
                >
                    Create Quizzes
                </button>
            </div>
        </div>
        </DashboardLayout>
    );
};
export default MentorPage;
