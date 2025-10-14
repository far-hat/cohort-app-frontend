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
        { label : "Dashboard" , path : "/candidate-dashboard" , icon: "icon" },
        { label : "Register for Course" , path : "/register-course" , icon: "icon" },
        { label : "View Available Courses" , path : "/view-courses" , icon : "icon" },
        { label : "View Available Quizzes" , path : "/view-quizzes" , icon :"icon" },
        { label : "View Result" , path : "/view-result" , icon : "icon" },
    ],
    Guest : [
        { label : "Dashboard" , path : "/guest-dashboard" , icon: "icon" },
        { label : "Register" , path : "/register" , icon : "icon" },
        { label : "Login" , path : "/login" , icon :"icon" },
    ],
}