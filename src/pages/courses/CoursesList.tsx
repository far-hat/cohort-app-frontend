import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Course } from "@/types/courseTypes"
import { formatDate } from "date-fns";
import { useNavigate } from "react-router-dom";
import { formatDateOnly } from "../quizpages/QuizListInfo";

export type Props = {
    courses: Course[];
    isPending: boolean,
    role: string,
}
export const CoursesList = ({ courses, isPending, role }: Props) => {

    const navigate = useNavigate();

    const handleCreateCourse = () => {
        navigate("/mentor/course/create");
    }

    const handleViewClick = (id: string) => {
        navigate(`/mentor/course/view/${id}`);
    }

        if (isPending) return <span>Loading Courses...</span>

        return (
            <div className="m-4">
                {role === "mentor" && (
                    <div className="sticky top-2 bg-white py-4 z-10 border-b">
                        <Button
                            onClick={handleCreateCourse}
                            className="bg-blue-600 hover:bg-blue-400 text-white">Create Course</Button>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6 px-2">
                    <h2 className="text-2xl font-bold">
                        {role === "mentor" ? "My Courses" : "Available Courses"}
                    </h2>
                </div>


                <div className="rounded-md border w-full overflow-hidden">
                    <Table className="bg-gray-50">
                        <TableHeader>
                            <TableRow>
                            <TableHead className="font-bold">Course Name</TableHead>
                            <TableHead className="font-bold">Course Description</TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                            <TableHead className="font-bold">Created At</TableHead>
                            <TableHead className="font-bold">Actions</TableHead>
                        </TableRow>
                        </TableHeader>

                        <TableBody>
                            {courses.map((course)=>{
                                return(
                                    <TableRow key={course.course_id}
                                    className="hover:bg-gray-100">
                                        <TableCell className="font-semibold">{course.course_title}</TableCell>
                                        <TableCell className="font-semibold">{course.description}</TableCell>
                                        <TableCell className="font-semibold">{course.status}</TableCell>
                                        <TableCell className="font-semibold">{formatDateOnly(course.created_at)}</TableCell>
                                        <TableCell>{role === "mentor" ? (
                                            <div className="flex gap-2">
                                                <Button className="hover:bg-gray-200"
                                                onClick={()=> handleViewClick(course.course_id)}>View</Button>
                                            </div>
                                        ):(
                                            <div>Candidate Actions here</div>
                                        )}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>

            </div>
        )
    

}