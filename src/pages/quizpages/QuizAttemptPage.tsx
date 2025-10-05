import quizzes from "../../mockdata/quizzes.json";
import questions from "../../mockdata/questions.json";
import { useParams } from "react-router-dom";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

//  schema for form validation
const attemptSchema = z.record(z.string(), z.string().nonempty("Required"));

type QuizForm = z.infer<typeof attemptSchema>;

type Props = {
    onSave: (QuizData: QuizForm) => void;
    isPending: boolean;
};

const QuizAttemptPage = ({ onSave, isPending }: Props) => {
    const { quizId } = useParams();
    const quiz = quizzes.find(q => q.quiz_id == quizId);
    if (!quiz) {
        return <span>Quiz not found</span>;
    }


    const [quesIndex, setIndex] = useState(0);
    const questionArray = questions.filter((ques) => ques.quiz_id === quiz.quiz_id);
    const [hasStarted,setHasStarted ] = useState(false);
    const question = questionArray[quesIndex];
    const defaultValues: Record<string, string> = {};
    questionArray.forEach(ques => {
        defaultValues[ques.question_id] = ""
    });

    const form = useForm<QuizForm>({
        resolver: zodResolver(attemptSchema),
        defaultValues,
    });
    const handleNextQuestion = () => {
        if (quesIndex < questionArray.length - 1) {
            setIndex(quesIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (quesIndex > 0) {
            setIndex(quesIndex - 1);
        }
    };
    const handleStart = () => {
        setHasStarted(true);
    }

    const handleSubmitQuiz = form.handleSubmit((formData) => {
        onSave(formData);
    } )
        
    

    return (
        <div className="flex flex-col gap-6">
            <Card className="flex flex-col gap-6 max-w-4xl mx-auto p-4 bg-indigo-400">
                <CardHeader className="font-bold">Quiz Name: {quiz.course_title}</CardHeader>
                {!hasStarted &&
                    <>
                    <CardDescription className="font-semibold italic text-red-800">{quiz.instructions}</CardDescription>
                <Button className="bg-gray-300 mt-4 w-full" variant="default" onClick={handleStart} >
                    Start Quiz
                </Button>
                </>
                }
            </Card>

            {hasStarted &&
                <Form {...form}>
                <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4 bg-indigo-300">
                    <h3>
                        Q{quesIndex + 1}. {question.question_text}
                    </h3>

                    <Controller
                        control={form.control}
                        name={question.question_id}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Options</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        className="space-y-2"
                                    >
                                        {question.options.map((option, oIndex) => (
                                            <div key={oIndex} className="flex items-center gap-2">
                                                <RadioGroupItem
                                                    value={option}
                                                    id={`option-${quesIndex}-${oIndex}`}
                                                />
                                                <label htmlFor={`option-${quesIndex}-${oIndex}`}>{option}</label>
                                            </div>
                                        ))}


                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-between mt-4">
                        <Button variant="default" onClick={handlePreviousQuestion} disabled={quesIndex === 0}>
                            Previous
                        </Button>
                        <Button variant="default" onClick={handleNextQuestion} disabled={quesIndex === questionArray.length - 1}>
                            Next
                        </Button>
                    </div>
                    {
                        quesIndex === questionArray.length - 1 && 
                        (<Button onClick={handleSubmitQuiz} disabled={isPending}>   {isPending? "Submitting":"Submit your responses."}</Button>)
                    }
                </div>
            </Form>
            }
        </div>
    );
};

export default QuizAttemptPage;
