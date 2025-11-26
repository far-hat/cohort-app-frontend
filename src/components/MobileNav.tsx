import { CircleUserRound, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import MobileNavLinks from "./MobileNavLinks";


const MobileNav = () => {
    const {user,isAuthenticated,loginWithRedirect} =useAuth0();
    return(
        <Sheet >
            <SheetTrigger >
                <Menu />
            </SheetTrigger>
            <SheetContent className="bg-white-500">
                <SheetTitle>
                    {isAuthenticated ? (<span className="flex items-center font-bold gap-2 ">
                        <CircleUserRound className="bg-white text-navy-500"/> {user?.name}
                    </span>) : (<span className="bg-white text-navy-500">Welcome to Cohort Learning Application</span>)}
                    
                </SheetTitle>

                <Separator />
                <SheetDescription className="flex flex-col gap-4">
                    {isAuthenticated ? (<MobileNavLinks/>

                    ): <Button 
                    onClick={async()=> await loginWithRedirect()}
                    className="flex flex-1 font-bold bg-blue-500 hover:bg-blue-400" variant="ghost">Log In</Button>}
                    
                </SheetDescription>

            </SheetContent>
        </Sheet>
    );
}
export default MobileNav;