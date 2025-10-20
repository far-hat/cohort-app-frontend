import { useCreateUserRequest } from "@/api/UserApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";
import AdminPage from "./userpages/AdminPage";
import MentorPage from "./userpages/MentorPage";
import CandidatePage from "./userpages/CandidatePage";

const AuthCallbackPage = () => {
  const { user, isLoading } = useAuth0();
  const { createUser } = useCreateUserRequest();
  const hasCreatedUser = useRef(false);

  const [roles, setRoles] = useState<string[]>([]);
  const [activeSession, setActiveSession] = useState<
    "admin" | "mentors" | "candidates" | null
  >(null);

  useEffect(() => {
    
    if (isLoading || !user) return;

    const detectedRoles = user?.["http://localhost:5173/roles"] || [];
    setRoles(detectedRoles);

    if (user?.sub && user?.email && user?.name && !hasCreatedUser.current) {
      createUser({
        auth0Id: user.sub,
        email: user.email,
        user_name: user.name,
        roles: detectedRoles,
      });
      hasCreatedUser.current = true;
    }

    // auto-select role page
    if (detectedRoles.includes("Admin")) setActiveSession("admin");
    else if (detectedRoles.includes("Mentor")) setActiveSession("mentors");
    else if (detectedRoles.includes("Candidate")) setActiveSession("candidates");
  }, [createUser, isLoading, user]);

  // Render correct page
  if (activeSession === "admin") return <AdminPage />;
  if (activeSession === "mentors") return <MentorPage />;
  if (activeSession === "candidates") return <CandidatePage />;

  return <div className="p-8 text-center">Loading role...</div>;
};

export default AuthCallbackPage;
