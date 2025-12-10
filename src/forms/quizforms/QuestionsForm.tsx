import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LoadingButton from "@/components/LoadingButton";
import { useEffect } from "react";

// Zod schemas
const optionSchema = z.object({
  value: z.string().min(1, "Option is required"),
});

const questionSchema = z.object({
  question_text: z.string().min(1, "Question is required"),
  options: z.array(optionSchema).min(2, "At least 2 options required").max(4),
  correct_answer: z.string().min(1, "Pick a correct answer"),
});

const formSchema = z.object({
  questions: z.array(questionSchema).min(1, "At least one question required"),
});

export type QuestionData = z.infer<typeof formSchema>;

type Props = {
  onSave: (questionData: QuestionData) => void;
  isPending : boolean;
  initialData? : QuestionData;
  isEdit? : boolean;
};

export const QuestionsForm = ({ onSave,isPending,initialData,isEdit=false }: Props) => {
  const form = useForm<QuestionData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      questions: [
        {
          question_text: "",
          options: [{ value: "" }, { value: "" }],
          correct_answer: "",
        },
      ],
    },
  });

  useEffect( ()=> {
    if(initialData){
      form.reset(initialData);
    }
  },[initialData,form]);

  const {
    fields: questionFields,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

 
  const watchedQuestions = useWatch({
    control: form.control,
    name: "questions",
  });

 
  const addOption = (qIndex: number) => {
    const currentOptions = form.getValues(`questions.${qIndex}.options`);
    form.setValue(`questions.${qIndex}.options`, [...currentOptions, { value: "" }]);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const currentOptions = form.getValues(`questions.${qIndex}.options`);
    const updatedOptions = currentOptions.filter((_, index) => index !== oIndex);

    form.setValue(`questions.${qIndex}.options`, updatedOptions);

    //remove if correct answer was cleared
    const correctAnswer = form.getValues(`questions.${qIndex}.correct_answer`);
    if (correctAnswer === currentOptions[oIndex].value) {
      form.setValue(`questions.${qIndex}.correct_answer`, "");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (data) => {
            onSave(data);
          },
          (errors) => {
            console.warn(" Validation errors:", errors);
          }
        )}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{isEdit? `Edit Questions` : `Add Questions`}</h2>
        </div>

        {questionFields.map((q, qIndex) => {
          const currentOptions = watchedQuestions?.[qIndex]?.options || [];

          return (
            <div key={q.id} className="border p-4 rounded-md space-y-4">
              {/* Question Text */}
              <FormField
                control={form.control}
                name={`questions.${qIndex}.question_text`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question {qIndex + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter question text" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-700"/>
                  </FormItem>
                )}
              />

              {/* Options with correct answer selector */}
              <Controller
                control={form.control}
                name={`questions.${qIndex}.correct_answer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Options</FormLabel>
                    <FormDescription>
                      Add up to 4 options and choose the correct one.
                    </FormDescription>

                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="space-y-2 "
                      >
                        {currentOptions.map((option, oIndex) => {
                          const watchedOptionValue = option?.value ?? "";

                          return (
                            <div
                              key={oIndex}
                              className="flex items-center gap-2 my-2 "
                            >
                              {/* Option Input */}
                              <Input
                                {...form.register(
                                  `questions.${qIndex}.options.${oIndex}.value`
                                )}
                                placeholder={`Option ${oIndex + 1}`}
                              />

                              {/* Radio Button for correct answer */}
                              <RadioGroupItem
                                value={watchedOptionValue}
                                id={`q${qIndex}o${oIndex}`}
                                disabled={!watchedOptionValue}
                                className="checked:border-gray-900 bg-gray-300"
                              />
                              <FormLabel
                                htmlFor={`q${qIndex}o${oIndex}`}
                                className="cursor-pointer"
                              >
                                Correct
                              </FormLabel>

                              {/* Remove Option */}
                              {currentOptions.length > 2 && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeOption(qIndex, oIndex)}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>

                    <FormMessage className="text-red-700"/>

                    {/* Add Option Button */}
                    {currentOptions.length < 4 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(qIndex)}
                        className="mt-2"
                      >
                        + Add Option
                      </Button>
                    )}
                  </FormItem>
                )}
              />

              {/* Remove Question Button */}
              {questionFields.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeQuestion(qIndex)}
                >
                  Remove Question
                </Button>
              )}
            </div>
          );
        })}

        {/* Add Question Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            addQuestion({
              question_text: "",
              options: [{ value: "" }, { value: "" }],
              correct_answer: "",
            })
          }
        >
          + Add Question
        </Button>

        {/* Submit Button */}
        {
          isPending ? (<LoadingButton/>) : 
          (<Button
          type="submit"
          className="bg-blue-900 text-white hover:bg-blue-700"
        >
          {isEdit ? `Update Questions`:`Save Questions`}
        </Button>)
        }
      </form>
    </Form>
  );
};
