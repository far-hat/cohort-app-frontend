export type CreateUserRequest = {
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

export type UpdateMentorRequest = {
  full_name: string;
  phone: string;
  expertise: string;
  role: string;
};

export type UpdateCandidateRequest = {
  full_name: string;
  phone: string;
  education_level: string;
  role: string;
};
