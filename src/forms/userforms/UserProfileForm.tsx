import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  role: z.enum(["mentor", "candidate"]),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof formSchema>;

type Props = {
  onSave: (userProfileData: UserFormData) => void;
  isPending: boolean;
};

const UserProfileForm = ({ onSave, isPending }: Props) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "candidate",
      isActive: true,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="space-y-6 bg-gray-400 text-cream-500 rounded-lg p-6 md:p-10"
      >
        <div>
          <h2 className="text-2xl font-bold text-cream-400">User Profile</h2>
          <FormDescription>
            View and change your profile here.
          </FormDescription>

          {/* Role field */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-col gap-2 mt-2"
                  >
                    <div className="flex items-center space-x-2 ">
                      <RadioGroupItem value="candidate" id="candidate" className="data-[state=checked]:bg-gray-700 data-[state=checked]:border-gray-700"/>
                      <Label htmlFor="candidate"
                      className="cursor-pointer">Candidate</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="mentor" id="mentor"  className="data-[state=checked]:bg-gray-700 data-[state=checked]:border-gray-700"/>
                      <Label htmlFor="mentor" className="cursor-pointer">Mentor</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Active field */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between w-52 rounded-lg border p-3 shadow-sm">
                <FormLabel className="text-sm font-medium accent-gray-700">Active</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-gray-700 data-[state=checked]:border-gray-700"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {isPending ? <LoadingButton /> : <Button type="submit"
        className=" bg-blue-900 text-white hover:bg-blue-700">
            Submit
        </Button>
        }
      </form>
    </Form>
  );
};

import {useUpdateMentorRequest } from "@/api/UserApi";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserRoles } from "@/RoleProtectedRoutes";
import { Input } from "@/components/ui/input";

const mentorFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  expertise: z.string().min(1, "Expertise is required"),
});

type MentorFormData = z.infer<typeof mentorFormSchema>;

export const MentorRegistrationForm = () => {
  const { updateMentor, isPending } = useUpdateMentorRequest();
  const navigate = useNavigate();

  const { user } = useAuth0();
  
  const roleGot = getUserRoles(user);

  const form = useForm<MentorFormData>({
    resolver: zodResolver(mentorFormSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      expertise: "",
    },
  });

  const handleSubmit = async (formData: MentorFormData) => {
    try {
      await updateMentor({
        full_name: formData.full_name,
        phone: formData.phone,
        expertise: formData.expertise,
        role: roleGot[0] || "Mentor"
      });
      
      
      navigate("/mentor");
    } catch (error) {
      console.error("Failed to register as mentor:", error);
    }
  };

  return (
    <div  className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Mentor Registration</h2>
            <p className="text-gray-600 mt-2">Complete your mentor profile</p>
          </div>
      
      <FormField control={form.control}
      name="full_name"
      render={ ( {field}) => (
        <FormItem>
          <FormLabel  className="text-gray-700">Full Name</FormLabel>
          <FormControl>
             <Input 
                    placeholder="Enter your full name" 
                    {...field} 
                    className="w-full"
                  />
          </FormControl>
          <FormMessage className="text-red-700"/>
        </FormItem>
      )}
      />

      <FormField control={form.control}
      name="phone"
      render={ ( {field}) => (
        <FormItem>
          <FormLabel  className="text-gray-700">Phone number</FormLabel>
          <FormControl>
             <Input 
                    placeholder="Enter your phone number" 
                    {...field} 
                    className="w-full"
                  />
          </FormControl>
          <FormMessage className="text-red-700"/>
        </FormItem>
      )}
      />

      <FormField control={form.control}
      name="expertise"
      render={ ( {field}) => (
        <FormItem>
          <FormLabel  className="text-gray-700">Area of Expertise</FormLabel>
          <FormControl>
             <Input 
                   placeholder="e.g., Web Development, Data Science, UI/UX Design"
                    {...field} 
                    className="w-full"
                  />
          </FormControl>
          <FormMessage className="text-red-700"/>
        </FormItem>
      )}
      />

      <Button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
          >
            {isPending ? "Registering..." : "Complete Registration"}
          </Button>
    </form>
    </Form>
    </div>
  );
};
