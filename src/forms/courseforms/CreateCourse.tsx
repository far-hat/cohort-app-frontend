import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {z} from "zod";

const courseSchema = z.
    object({
        course_title : z.string().min(1,"Course name is required"),
        description : z.string().min(1,"Course description is required"),
    });

export type CourseFormData = z.infer<typeof courseSchema>;

type Props = {
    onSave : (CourseData : CourseFormData) => void;
    isPending : boolean,
}

export const CourseForm = ({onSave, isPending} : Props) => {
    const form = useForm<CourseFormData>({
        resolver :zodResolver(courseSchema),
        defaultValues : {
            course_title : "",
            description : ""
        }
    });

    return(
        <Form {...form}>
            <div className="flex justify-center px-4">
                <form 
                    onSubmit={form.handleSubmit(onSave)}
                    className="max-w-2xl mx-auto bg-gray-100 shadow-md rounded-lg p-6 md:p-10 space-y-6 text-gray-900">
                        <div>
                            <h2 className="text-3xl font-bold ">Course Info</h2>

                            <FormDescription className="text-2xl"> Enter course details here</FormDescription>

                            <FormField 
                                control={form.control}
                                name="course_title"
                                render= {({field}) => (
                                    <FormItem>
                                        <FormLabel>Course Title</FormLabel>
                                        <FormControl><Input{...field}/></FormControl>
                                        <FormMessage className="text-red-700"/>
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="description"
                                render = {({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Course Description
                                        </FormLabel>
                                        <FormControl>
      <Input{...field}/>
    </FormControl>
                                        <FormMessage className="text-red-700"/>
                                    </FormItem>
                                )}/>
                            
                        </div>


                        {isPending? (<LoadingButton />) : (
                            <Button
                                type="submit"
                                className="w-full md:w-auto bg-blue-800 hover:bg-blue-600 text-white px-6 py-2 rounded">Submit</Button>
                        )}
                    </form>
            </div>
        </Form>
    );
};