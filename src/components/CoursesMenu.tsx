import { Link, useNavigate } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button";

export const CoursesMenu = () => {
    const navigate = useNavigate();

    return(
        <>
            <Button className="bg-blue-700 text-white rounded" onClick={()=>navigate("/mentor/courses/create")}>Create Course</Button>
            <pre>This page is under development.</pre>
        </> 
        
    )
}