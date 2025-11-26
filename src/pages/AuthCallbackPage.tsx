import { useCreateUserRequest } from "@/api/UserApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { replace, useNavigate } from "react-router-dom";
import { getUserRoles } from "@/RoleProtectedRoutes";

const AuthCallbackPage = () => {
  const { user, isLoading } = useAuth0();
  const { createUser } = useCreateUserRequest();
  const hasCreatedUser = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    
    if (isLoading || !user) return;

    const detectedRoles = getUserRoles(user);

    if (user?.sub && user?.email && user?.name && !hasCreatedUser.current) {
      createUser({
        auth0Id: user.sub,
        email: user.email,
        user_name: user.name,
        roles: detectedRoles[0],
      });
      hasCreatedUser.current = true;
    }

    // auto-select role page
    if (detectedRoles.includes("Admin")) {
      navigate("/admin",{replace : true});
    }
    else if (detectedRoles.includes("Mentor")) {
      navigate("/mentor",{replace : true})
    }
    else if (detectedRoles.includes("Candidate")){
      navigate("/candidate",{replace : true})
    }else{
      navigate("/unauthorized",{replace : true})
    }
  },[createUser,isLoading,user,navigate]);

  return <div className="p-8 text-center">Loading role...</div>;
};

export default AuthCallbackPage;
