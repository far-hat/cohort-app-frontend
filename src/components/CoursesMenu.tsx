import { Link } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

export const CoursesMenu = () => {
    return(
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2">
                <span className="p-10 font-bold text-black hover:text-green-700">Courses</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-300">
                
                <DropdownMenuItem>
                    <Link to="/" className="font-bold hover:text-green-700">View Courses</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}