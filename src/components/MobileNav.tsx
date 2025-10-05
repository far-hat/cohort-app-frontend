import { CircleUserRound, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import MobileNavLinks from "./MobileNavLinks";


const MobileNav = () => {
    const {user,isAuthenticated,loginWithRedirect} =useAuth0();
    return(
        <Sheet>
            <SheetTrigger>
                <Menu className="text-gray-500" />
            </SheetTrigger>
            <SheetContent>
                <SheetTitle>
                    {isAuthenticated ? (<span className="flex items-center font-bold gap-2 bg-white">
                        <CircleUserRound className="bg-white text-gray-500"/> {user?.name}
                    </span>) : (<span className="bg-white text-navy-500">Welcome to Cohort Learning Application</span>)}
                    
                </SheetTitle>

                <Separator />
                <SheetDescription className="flex">
                    {isAuthenticated ? (<MobileNavLinks/>

                    ): <Button 
                    onClick={()=> loginWithRedirect()}
                    className="flex-1 font-bold bg-white">Log In</Button>}
                    
                </SheetDescription>

            </SheetContent>
        </Sheet>
    );
}
export default MobileNav;