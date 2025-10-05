import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar1 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// --- SCHEMA ---
const quizSchema = z
  .object({
    course_name: z.string().min(1, "Course name is required"),
    start_date: z.date().optional(),
    start_time: z.string().optional(),
    end_date: z.date().optional(),
    end_time: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.start_date || !data.end_date) return true;

      // combine date + time
      const start = new Date(data.start_date);
      if (data.start_time) {
        const [h, m] = data.start_time.split(":").map(Number);
        start.setHours(h, m, 0, 0);
      }

      const end = new Date(data.end_date);
      if (data.end_time) {
        const [h, m] = data.end_time.split(":").map(Number);
        end.setHours(h, m, 0, 0);
      }

      return end > start;
    },
    {
      message: "End date/time must be after start date/time",
      path: ["end_time"],
    }
  );

export type QuizFormData = z.infer<typeof quizSchema>;
type Props = { onSave: (QuizData: QuizFormData) => void; isPending: boolean };

export const QuizForm = ({ onSave, isPending }: Props) => {
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      course_name: "",
      start_date: undefined,
      start_time: "",
      end_date: undefined,
      end_time: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="space-y-6 bg-cream-400 text-blue-500 rounded-lg p-6 md:p-10"
      >
        <div>
          <h2 className="text-2xl font-bold text-cream-400">Quiz Info</h2>
          <FormDescription>Enter Quiz details here</FormDescription>

          {/* Course Name */}
          <FormField
            control={form.control}
            name="course_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Dates + Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Start */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Begins From</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {field.value ? field.value.toDateString() : "Pick a date"}
                          <Calendar1 className="ml-auto h-4 w-8 opacity-70" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-4" align="end" >
                        <Calendar
                          className="rdp mx-1"
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* End */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ends On</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {field.value ? field.value.toDateString() : "Pick a date"}
                          <Calendar1 className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                        className="rdp mx-1"
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        {isPending ? (
          <LoadingButton />
        ) : (
          <Button
            type="submit"
            className="bg-blue-900 text-white hover:bg-blue-700"
          >
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
};
