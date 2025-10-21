import { useParams } from "react-router-dom";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetQuizById } from "@/api/QuizApi";


const attemptSchema = z.record(z.string(), z.string().nonempty("Please select an answer"));

type QuizForm = z.infer<typeof attemptSchema>;

type Props = {
    onSave: (quizData: QuizForm) => void;
    isPending: boolean;
};

export const QuizAttemptForm = ({ onSave, isPending }: Props) => {
    const { quizId } = useParams();
    const [quesIndex, setIndex] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

   
    const { quiz, isPending: isQuizLoading } = useGetQuizById(Number(quizId));
    

    if (isQuizLoading ) {
        return <div className="flex justify-center p-8">Loading quiz...</div>;
    }

    if (!quiz) {
        return <span>Quiz not found</span>;
    }
    const questionArray = quiz.questions || [];
    
    if (!questionArray || questionArray.length === 0) {
        return <span>No questions available for this quiz</span>;
    }

    const question = questionArray[quesIndex];

    const defaultValues: Record<string, string> = {};
    questionArray.forEach(ques => {
        defaultValues[ques.question_id.toString()] = ""; 
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
    });

    return (
        <div className="flex flex-col gap-6 min-h-screen bg-gray-50 p-4">
            <Card className="max-w-4xl mx-auto w-full p-6 bg-white shadow-lg">
                <CardHeader className="text-2xl font-bold text-center text-gray-800">
                    {quiz.course_name}
                </CardHeader>
                
                {!hasStarted ? (
                    <div className="space-y-4">
                        <CardDescription className="text-lg text-gray-600 text-center">
                            {quiz.quiz_description}
                        </CardDescription>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h4 className="font-semibold text-yellow-800 mb-2">Instructions:</h4>
                            <p className="text-yellow-700">• Read each question carefully</p>
                            <p className="text-yellow-700">• Select the best answer</p>
                            <p className="text-yellow-700">• You can navigate between questions</p>
                            <p className="text-yellow-700">• Submit when you're finished</p>
                        </div>
                        <div className="text-center mt-6">
                            <Button 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                                onClick={handleStart}
                            >
                                Start Quiz
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Form {...form}>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-gray-500">
                                    Question {quesIndex + 1} of {questionArray.length}
                                </span>
                                <span className="text-sm font-medium text-gray-700">
                                    {quiz.course_name}
                                </span>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-800">
                                Q{quesIndex + 1}. {question.question_text}
                            </h3>

                            <Controller
                                control={form.control}
                                name={question.question_id.toString()} 
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-medium">Select your answer:</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="space-y-3 mt-4"
                                            >
                                                {question.options.map((option, oIndex) => (
                                                    <div 
                                                        key={option.option_id} 
                                                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        <RadioGroupItem
                                                            value={option.option_text}
                                                            id={`option-${quesIndex}-${oIndex}`}
                                                        />
                                                        <label 
                                                            htmlFor={`option-${quesIndex}-${oIndex}`}
                                                            className="flex-1 cursor-pointer text-gray-700 font-medium"
                                                        >
                                                            {option.option_text}
                                                        </label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
                                <Button 
                                    variant="outline" 
                                    onClick={handlePreviousQuestion} 
                                    disabled={quesIndex === 0}
                                    className="px-6"
                                >
                                    Previous
                                </Button>
                                
                                {quesIndex === questionArray.length - 1 ? (
                                    <Button 
                                        onClick={handleSubmitQuiz} 
                                        disabled={isPending}
                                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                                    >
                                        {isPending ? "Submitting..." : "Submit Quiz"}
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="default" 
                                        onClick={handleNextQuestion}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                                    >
                                        Next
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Form>
                )}
            </Card>
        </div>
    );
};

