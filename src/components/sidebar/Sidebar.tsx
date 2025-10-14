import { Link, useLocation } from "react-router-dom";
import { sideBarLinks } from "./sidebar-config";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type SideBarProps = {
    role: "Admin" | "Mentor" | "Candidate" | "Guest";
}

export const SideBar = ({ role }: SideBarProps) => {
    const links = sideBarLinks[role];
    const { pathname } = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden md:flex flex-col h-screen border-r bg-white shadow-lg p-4 transition-all duration-300", 
                collapsed ? "w-16" : "w-64"
            )}>
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">   
                    {!collapsed && <h2 className="text-xl font-bold text-gray-800">Menu</h2>}
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setCollapsed(!collapsed)}
                        className="hover:bg-gray-100"
                    >
                        {collapsed ? "→" : "←"}
                    </Button>
                </div>

                <nav className="flex flex-col gap-3">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                                "px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium",
                                "hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm",
                                pathname === link.path 
                                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600 font-bold" 
                                    : "text-gray-700",
                                collapsed && "flex justify-center px-2"
                            )}
                            title={collapsed ? link.label : undefined}
                        >
                            <div className="flex items-center gap-3">
                                <span className={cn("text-lg", collapsed && "text-xl")}>
                                    {collapsed ? link.label.charAt(0) : link.label}
                                </span>
                            </div>
                        </Link>
                    ))}
                </nav>

                {!collapsed && (
                    <div className="mt-auto pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500 text-center">CohortQuiz</p>
                    </div>
                )}
            </aside>
        </>
    );
};