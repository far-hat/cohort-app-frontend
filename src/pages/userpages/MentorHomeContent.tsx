export const MentorHomeContent = () => {
    return (
        <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Quick Stats</h3>
                    <p className="text-gray-600">View your teaching analytics</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Recent Activity</h3>
                    <p className="text-gray-600">Check student submissions</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Upcoming</h3>
                    <p className="text-gray-600">See scheduled quizzes</p>
                </div>
            </div>
        </div>
    );
}