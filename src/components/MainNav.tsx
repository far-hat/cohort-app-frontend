import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";
import { NavMenu } from "./NavMenu";

const MainNav = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    return(
        <span className="flex space-x-2 items-center">
            {isAuthenticated ? 
                <NavMenu />
                 :
            <Button 
            variant="ghost"
            className="font-bold hover:text-gray-500 hover:bg-white"
            onClick={ async () => await loginWithRedirect()}>
                Log In
        </Button>} 

        </span>
        
    )

}

export default MainNav;