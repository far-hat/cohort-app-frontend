import { clearToken, getToken } from "@/auth/tokenManager";
import { useAuth0 } from "@auth0/auth0-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useApiClient = () => {
    const { getAccessTokenSilently } = useAuth0();

    const request = async (url: string, method: string = "GET", body?: any) => {
        const token = await getToken(getAccessTokenSilently);

        const res = await fetch(`${API_BASE_URL}${url}`, {
            method,
            headers : {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body : body ? JSON.stringify(body) : undefined,
        });

        if(res.status === 401){
            clearToken();
            const newToken = await getToken(getAccessTokenSilently);

            const retry = await fetch(`${API_BASE_URL}${url}`, {
                method,
                headers: {
                   "Content-Type": "application/json",
                    Authorization: `Bearer ${newToken}`, 
                },
                body : body ? JSON.stringify(body) : undefined,
            });

            if(!retry.ok) throw new Error(`HTTP ${retry.status}`);
            return retry.json();
        }

        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    }

    return {request};
}