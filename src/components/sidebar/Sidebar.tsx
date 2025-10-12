import { Link, useLocation } from "react-router-dom";
import { sideBarLinks } from "./sidebar-config"
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type SideBarProps = {
    role : "Admin" | "Mentor" | "Candidate" | "Guest"
}

export const SideBar = ({role} : SideBarProps) => {
    //links
    const links = sideBarLinks[role];
    //paths
    const {pathname} = useLocation();
    //useState
    const [collapsed,setCollapsed] = useState(false);

    //return func
    return(
        <>
        {/*Mobile */}
        {/*Desktop*/ }
        <aside className={cn("hidden md:flex flex-col h-screen border-r bg-gray-200 dark:bg-black-800 p-4 transition-all duration-300", collapsed ? "w-20" : "w-64")}>
            <div className="flex justify-between items-center mb-4 ">   
                {!collapsed && <h2 className="text-xl font-bold">Menu</h2>}
                <Button variant="ghost" size="sm" 
                onClick={ ()=> setCollapsed(!collapsed)}>
                    {collapsed ? "" : "<"}
                </Button>
            </div>

            <nav className="flex flex-col gap-2">
                {links.map( (link) => (
                    <Link key={link.path}
                    to={link.path}
                    className={ cn ("px-4 py-2 rounded hover:bg-muted", 
                        pathname === link.path && "bg-muted font-semi-bold" , 
                        collapsed && "text-sm text-center"
                    )}>
                        {collapsed ? link.label.charAt(0) : link.label }
                    </Link>
                ))}
            </nav>

        </aside>
        </>
    )
}