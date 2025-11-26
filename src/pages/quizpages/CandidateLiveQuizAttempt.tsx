import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSocket } from "@/hooks/useSocket";
import { useGetQuizById } from "@/api/QuizApi";
import { attemptSchema, LiveQuestion, LiveQuestionOption } from "@/types/liveQuizTypes";




export const RealTimeQuizAttempt = () => {
    const { quizId } = useParams();
    const { quiz, isPending: isQuizLoading } = useGetQuizById(Number(quizId));

    const { quizState, socket, isConnected } = useSocket(Number(quizId));
    
    const [hasJoined, setHasJoined] = useState(false);
    const [locked, setLocked] = useState(false);

    const form = useForm({
        resolver: zodResolver(attemptSchema),
        defaultValues: { answer: "" }
    });

    const question = quizState?.state === "question" ? quizState.question : null;;

    // Candidate joins room once
    const handleJoinQuiz = () => {
        if (!socket || hasJoined) return;
        socket.emit("candidate_joined", { quizId: Number(quizId) });
        setHasJoined(true);
    };

    // Lock and submit answer for current question
    const handleLockAnswer = form.handleSubmit((data) => {
        setLocked(true);
        socket?.emit("candidate_answered", {
            quizId: Number(quizId),
            questionId: question?.question_id,
            answer: data.answer
        });
    });

    // Reset when next question arrives
    useEffect(() => {
        if (!question) return;
        setLocked(false);
        form.reset({ answer: "" });
    }, [question]);

    if (isQuizLoading) {
        return <div className="flex justify-center p-8">Loading quiz...</div>;
    }

    if (!quiz) {
        return <div className="text-center p-8">Quiz not found</div>;
    }

    return (
        <div className="flex flex-col gap-6 min-h-screen bg-gray-50 p-4">
            <Card className="max-w-4xl mx-auto w-full p-6 bg-white shadow-lg">

                <CardHeader className="text-2xl font-bold text-center text-gray-800">
                    {quiz.course_name}
                </CardHeader>

                {/* NOT CONNECTED TO SOCKET */}
                {!isConnected && (
                    <div className="text-center text-red-500 font-medium">
                        Connecting to quiz session...
                    </div>
                )}

                {/* BEFORE JOINING */}
                {!hasJoined && (
                    <div className="text-center">
                        <CardDescription className="mb-4 text-gray-600">
                            Waiting to join live quiz session. Click below:
                        </CardDescription>

                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                            onClick={handleJoinQuiz}
                            disabled={!isConnected}
                        >
                            Join Quiz
                        </Button>
                    </div>
                )}

                {/* QUIZ STOPPED */}
                {quizState?.state === "finished" && (
                    <div className="text-center mt-6 text-xl font-semibold text-green-700">
                        Quiz Finished — Thank you!
                    </div>
                )}

                {/* QUIZ PAUSED */}
                {quizState?.state === "paused" && (
                    <div className="text-center mt-6 text-lg text-yellow-600 font-medium">
                        Quiz is paused by mentor...
                    </div>
                )}

                {/* WAITING FOR FIRST QUESTION */}
                {hasJoined && quizState?.state === "waiting" && (
                    <div className="text-center mt-6 text-lg text-gray-600">
                        Waiting for mentor to start the quiz...
                    </div>
                )}

                {/* SHOW LIVE QUESTION */}
                {hasJoined && quizState?.state === "question" && question && (
                    <Form {...form}>
                        <div className="space-y-6 mt-4">

                            <h3 className="text-xl font-semibold text-gray-800">
                                {question.question_text}
                            </h3>

                            <Controller
                                control={form.control}
                                name="answer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-medium">Select your answer:</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="space-y-3 mt-4"
                                                disabled={locked}
                                            >
                                                {question.options.map((option : LiveQuestionOption, idx : number) => (
                                                    <div
                                                        key={option.option_id}
                                                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        <RadioGroupItem
                                                            value={option.option_text}
                                                            id={`option-${idx}`}
                                                        />
                                                        <label
                                                            htmlFor={`option-${idx}`}
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

                            <div className="text-center mt-8">
                                <Button
                                    onClick={handleLockAnswer}
                                    disabled={locked}
                                    className="bg-green-600 hover:bg-green-700 text-white px-10 py-2"
                                >
                                    {locked ? "Answer Locked" : "Lock Answer"}
                                </Button>
                            </div>

                        </div>
                    </Form>
                )}
            </Card>
        </div>
    );
};
