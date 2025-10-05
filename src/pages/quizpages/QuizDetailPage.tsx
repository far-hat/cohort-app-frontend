import { Link, useParams } from "react-router-dom";
import quizzes from "../../mockdata/quizzes.json"
import mentors from "../../mockdata/mentors.json"
import questions from "../../mockdata/questions.json"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";



const QuizDetailPage = () => {
    const { quizId } = useParams();
    const quiz = quizzes.find(q => q.quiz_id == quizId)
    if (!quiz) {
        return (
            <span>Quiz not found</span>
        )
    }

    const mentor = mentors.find(m => m.mentor_id == quiz.mentor_id);

    return (
        <div className="flex flex-col gap-6">
            <Button variant={"outline"} className="w-30 bg-blue-200 mt-4"> <Link to="/get-quiz-list">Back to quizzes</Link></Button>

            <Card className="flex flex-col gap-6 max-w-4xl mx-auto p-4 bg-indigo-300">
                <CardHeader>
                    <CardTitle>{quiz.course_title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Quiz Info</h2>
                        <p>Date : {quiz.quiz_date}</p>
                        <p>Start Time : {quiz.start_time}</p>
                        <span>End Time : {quiz.end_time}</span>
                        <p>Status: <Badge variant="destructive" className="bg-indigo-400">{quiz.status}</Badge></p>
                        <p>Duration : {quiz.duration}</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Mentor Info</h2>
                        <p>Name : {mentor?.name}</p>
                        <p>Bio : {mentor?.bio}</p>
                        <div className="flex gap-2">
                            {mentor?.expertise.map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-indigo-400">{skill}</Badge>
                            ))}
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Questions</h2>

                        {
                            questions.filter(ques => ques.quiz_id == quizId)
                                .map(ques => (
                                    <div className="p-3 border rounded-lg space-y-2" key={ques.question_id}>
                                        <p className="font-medium">{ques.question_text}</p>
                                        <ul className="list-disc list-inside">{ques.options.map((option, index) => (
                                            <li key={index}>{option}</li>
                                        ))}
                                        </ul>
                                        <p className="text-sm text-muted foreground">Correct : {ques.correct_answer}</p>
                                    </div>
                                ))
                        }
                    </div>
                    <div className="flex gap-3">
                        <Button className="bg-gray-400 mt-4">Add Question</Button>
                        <Button className="bg-gray-400 mt-4">Edit Question</Button>
                    </div>

                </CardContent>
            </Card>

        </div>
    )
}
export default QuizDetailPage;