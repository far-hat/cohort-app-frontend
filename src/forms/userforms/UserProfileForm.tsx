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

export default UserProfileForm;
