import { JSX } from "react";

type Role = "Admin" | "Mentor" | "Candidate" | "Guest" ;

type SideBarLink = {
    label : string,
    path : string,
    icon : string,
}

export const sideBarLinks : Record<Role, SideBarLink[]> = {
    Admin : [
        { label : "Dashboard" , path : "/admin-dashboard" , icon: "icon" },
        { label : "Manage Users" , path : "/manage-users" , icon: "icon" },
        { label : "Courses" , path : "/courses" , icon : "icon" },
        { label : "Quizzes" , path : "quizzes" , icon :"icon" },
    ],
    Mentor : [
        { label: "Home", path: "/mentor",icon:"icon" },
        { label: "Courses", path: "/mentor/courses" ,icon:"icon"},
        { label: "Quiz", path: "/mentor/quizzes" ,icon:"icon"},
    ],
    Candidate : [
        { label : "Home" , path : "/candidate" , icon: "icon" },
        { label : "Courses" , path : "/candidate/courses" , icon: "icon" },
        { label : "Quizzes" , path : "/candidate/quizzes" , icon :"icon" },
        { label : "Result" , path : "/candidate/results" , icon : "icon" },
    ],
    Guest : [
        { label : "Dashboard" , path : "/guest-dashboard" , icon: "icon" },
        { label : "Register" , path : "/register" , icon : "icon" },
        { label : "Login" , path : "/login" , icon :"icon" },
    ],
}