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

// Zod schemas
const optionSchema = z.object({
  value: z.string().min(1, "Option is required"),
});

const questionSchema = z.object({
  questionText: z.string().min(1, "Question is required"),
  options: z.array(optionSchema).min(2, "At least 2 options required").max(4),
  correctAnswer: z.string().min(1, "Pick a correct answer"),
});

const formSchema = z.object({
  questions: z.array(questionSchema).min(1, "At least one question required"),
});

export type QuestionData = z.infer<typeof formSchema>;

type Props = {
  onSave: (questionData: QuestionData) => void;
};

export const QuestionsForm = ({ onSave }: Props) => {
  const form = useForm<QuestionData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questions: [
        {
          questionText: "",
          options: [{ value: "" }, { value: "" }],
          correctAnswer: "",
        },
      ],
    },
  });

  const {
    fields: questionFields,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  // ✅ Watch all questions once (no hooks inside map!)
  const watchedQuestions = useWatch({
    control: form.control,
    name: "questions",
  });

  // Option management
  const addOption = (qIndex: number) => {
    const currentOptions = form.getValues(`questions.${qIndex}.options`);
    form.setValue(`questions.${qIndex}.options`, [...currentOptions, { value: "" }]);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const currentOptions = form.getValues(`questions.${qIndex}.options`);
    const updatedOptions = currentOptions.filter((_, index) => index !== oIndex);

    form.setValue(`questions.${qIndex}.options`, updatedOptions);

    // If correct answer was removed, clear it
    const correctAnswer = form.getValues(`questions.${qIndex}.correctAnswer`);
    if (correctAnswer === currentOptions[oIndex].value) {
      form.setValue(`questions.${qIndex}.correctAnswer`, "");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (data) => {
            console.log("✅ Submitted data:", data);
            onSave(data);
          },
          (errors) => {
            console.warn("❌ Validation errors:", errors);
          }
        )}
        className="space-y-8"
      >
        {questionFields.map((q, qIndex) => {
          const currentOptions = watchedQuestions?.[qIndex]?.options || [];

          return (
            <div key={q.id} className="border p-4 rounded-md space-y-4">
              {/* Question Text */}
              <FormField
                control={form.control}
                name={`questions.${qIndex}.questionText`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question {qIndex + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter question text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Options with correct answer selector */}
              <Controller
                control={form.control}
                name={`questions.${qIndex}.correctAnswer`}
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
                        className="space-y-2"
                      >
                        {currentOptions.map((option, oIndex) => {
                          const watchedOptionValue = option?.value ?? "";

                          return (
                            <div
                              key={oIndex}
                              className="flex items-center gap-2 my-2"
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

                    <FormMessage />

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
              questionText: "",
              options: [{ value: "" }, { value: "" }],
              correctAnswer: "",
            })
          }
        >
          + Add Question
        </Button>

        {/* Submit Button */}
        <Button
          type="submit"
          className="bg-blue-900 text-white hover:bg-blue-700"
        >
          Save Questions
        </Button>
      </form>
    </Form>
  );
};
