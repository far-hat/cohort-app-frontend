import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CreateUserRequest = {
  auth0Id: string;
  email: string;
  user_name:string;
  roles: string;
};

// type CreateUserResponse = {
//   user_id: number;
//   email: string;
//   auth0Id: string;
//   isActive: boolean;
//   created_at: string;
//   updated_at: string;
// };

export const useCreateUserRequest = () => {
  const {getAccessTokenSilently} = useAuth0();


  const createUserRequest = async (
    user: CreateUserRequest
  )=> {

    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    //  parse and return backend response
    return response.json();
  };

  const {
    mutateAsync: createUser,
    isPending,
    isSuccess,
    isError,
   // data: createdUser, //  this will hold the backend response
  } = useMutation<void, Error, CreateUserRequest>({
    mutationFn: createUserRequest,
  });

  return {
    createUser,
    isPending,
    isSuccess,
    isError,
    
  };
};
