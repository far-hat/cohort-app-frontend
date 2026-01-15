import { useAuth0 } from "@auth0/auth0-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useApiClient = () => {
    const { getAccessTokenSilently } = useAuth0();

    const request = async (url: string, method: string = "GET", body?: any) => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE_URL}${url}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body : body? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: "Error fetching" }));
            throw new Error(error.message || "Request failed");
        }

        return res.json();

    }

    return {request};
}