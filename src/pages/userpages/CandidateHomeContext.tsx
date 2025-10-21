import { Button } from "@/components/ui/button"

export const CandidateHomeContent = () => {
    return(
        <div className="text-center py-8">
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-gray-600 mb-12">Ready for your next challenge?</p>
            
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border">
                <h3 className="text-xl font-semibold mb-4">📚 Learning Hub</h3>
                <p className="text-gray-700 mb-6">
                    Access quizzes, track your progress, and improve your skills through continuous assessment.
                </p>
                <div className="flex justify-center gap-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">Start Learning</Button>
                    <Button variant="outline">View Progress</Button>
                </div>
            </div>
        </div>
    )
}