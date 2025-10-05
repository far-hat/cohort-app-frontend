import { useAuth0 } from "@auth0/auth0-react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
    children: ReactNode;
    allowedRoles: string[];
};

function getUserRoles(user: any): string[] {
    return user?.["http://localhost:5173/roles"] || [];
}

const RoleProtectedRoutes = ({ children, allowedRoles }: Props) => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) return <div>Loading ... </div>;

    console.log("User Object:", user);

    if (!isAuthenticated) return <Navigate to="/" replace />; // redirect to home/login

    const roles = getUserRoles(user);
    console.log("Roles:", roles);

    const hasAccess = roles.some((role) => allowedRoles.includes(role));

    return hasAccess ? <>{children}</> : <Navigate to="/unauthorized" replace />;
};

export default RoleProtectedRoutes;
