import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar1 } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod"

const cohortSchema = z.
    object({
        cohort_name : z.string().min(1,"Cohort Name is required"),
        start_date : z.date(),
        end_date : z.date()
    })
    .refine((data) =>{
        if(!data.start_date || !data.end_date) return true;

        return data.end_date > data.start_date
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
);

export type CohortFormData = z.infer<typeof cohortSchema>;
type Props = {
    onSave : (CohortData : CohortFormData) => void;
    isPending : boolean
}

export const CreateCohortForm = ({onSave,isPending} :Props) => {
    const form = useForm<CohortFormData> ({
        resolver :zodResolver(cohortSchema),
        defaultValues : {
            cohort_name : "",
            start_date : undefined,
            end_date : undefined,
        }
    });

    return(
        <Form {...form}>
            <div className="flex justify-center px-4">
                <form onSubmit={form.handleSubmit(onSave)}
                className="w-full max-w-2xl mx-auto bg-gray-300 dark:bg-[#0f172a] shadow-md rounded-lg p-6 md:p-10 space-y-6 text-gray-900 dark:text-white">
                    <div>
                        <h2 className="text-3xl font-semibold text-indigo-900">Cohort Info</h2>

                        <FormDescription className="text-sm text-gray-500">Enter Cohort details </FormDescription>

                        <FormField 
                            control={form.control}
                            name="cohort_name"
                            render={({field}) => (
                              <FormItem>
                                <FormLabel>Cohort Name</FormLabel>
                                <FormControl>
                                    <Input {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-700"/>
                              </FormItem>  
                            )}
                            />

                            <div className="space-y-2">
                                <FormField 
                                    control={form.control}
                                    name="start_date"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Start Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-start text-left font-normal" >{field.value ?field.value.toDateString() :"Pick a date"} 
                                                        <Calendar1 className="ml-auto h-4 w-8 opacity-70"/>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white rounded-md shadow-lg" align="end">
                                                   <Calendar 
                                                    className="rdp mx-1"
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    autoFocus/> 
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage className="text-red-700"/>
                                        </FormItem>
                                    )}
                                    />
                            </div>

                             <div className="space-y-2">
                                <FormField 
                                    control={form.control}
                                    name="end_date"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>End Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-start text-left font-normal" >{field.value ?field.value.toDateString() : "Pick a date"}
                                                        <Calendar1 className="ml-auto h-4 w-8 opacity-70"/>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white rounded-md shadow-lg" align="end">
                                                   <Calendar 
                                                    className="rdp mx-1"
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    autoFocus/> 
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage className="text-red-700"/>
                                        </FormItem>
                                    )}
                                    />
                            </div>

                                    {isPending ? (
            <LoadingButton />
          ) : (
            <Button
              type="submit"
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded"
            >
              Submit
            </Button>
          )}
                    </div>
                </form>
            </div>

        </Form>
    )
}