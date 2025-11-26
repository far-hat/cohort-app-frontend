import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";

const MobileNavLinks = () => {
    const {logout} = useAuth0();
    return(
        <>
        <Link  
        to="/user-profile"
        className="flex items-center font-bold ">Profile</Link>

        <Button 
        onClick={()=> logout()}
        className="flex items-center px-3 font-bold  bg-white hover:bg-cream-500">Log Out</Button>
        </>
    )
}

export default MobileNavLinks;