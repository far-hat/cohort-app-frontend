import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu"

export const QuizMenu = () => {
    return(
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2">
                <span className="p-10 font-bold text-black hover:text-green-700">Quizzes</span>
            </DropdownMenuTrigger>
        </DropdownMenu>
    )
}