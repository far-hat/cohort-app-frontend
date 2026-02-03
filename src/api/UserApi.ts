import { CreateUserRequest, UpdateCandidateRequest, UpdateMentorRequest } from "@/types/userTypes";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const useCreateUserRequest = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createUserRequest = async (user: CreateUserRequest) => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to create user");
    }

    return data;
  };

  const { 
    mutateAsync: createUser, 
    isPending, 
    isSuccess, 
    isError, 
    error 
  } =
    useMutation<any, Error, CreateUserRequest>({
      mutationFn: createUserRequest,
    });

  return {
    createUser,
    isPending,
    isSuccess,
    isError,
    error,
  };
};



export const useUpdateMentorRequest = () => {
  const {getAccessTokenSilently} =useAuth0();

  const updateMentorRequest = async (userData: UpdateMentorRequest): Promise<any> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization : `Bearer ${accessToken}`
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user role");
    }

    return response.json();
  };

  const { mutateAsync: updateMentor, isPending, isError, isSuccess } = useMutation({
    mutationFn: updateMentorRequest,
  });

  return { 
    updateMentor, 
    isPending, 
    isError, 
    isSuccess 
  };
};


export const useUpdateCandidateRequest = () => {
  const {getAccessTokenSilently} =useAuth0();

  const updateCandidateRequest = async (userData: UpdateCandidateRequest): Promise<any> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization : `Bearer ${accessToken}`
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user role");
    }

    return response.json();
  };

  const { mutateAsync: updateCandidate, isPending, isError, isSuccess } = useMutation({
    mutationFn: updateCandidateRequest,
  });

  return { 
    updateCandidate, 
    isPending, 
    isError, 
    isSuccess 
  };
};