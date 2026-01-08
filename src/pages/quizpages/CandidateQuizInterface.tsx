// components/CandidateQuizInterface.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { attemptSchema } from "@/types/liveQuizTypes";
import { toast } from "sonner";
import { useQuizSocket } from "@/context/QuizSocketContext";

export const CandidateQuizInterface = ({quizId} : {quizId : number}) => {
  
  const numericQuizId = Number(quizId);

  const navigate = useNavigate();

  const {socket,quizState,isConnected,isLoading} = useQuizSocket();
  
  const [localAnswers, setLocalAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [lockedQuestions, setLockedQuestions] = useState<Set<number>>(new Set);

  const form = useForm({
    resolver: zodResolver(attemptSchema),
    defaultValues: { answer: "" }
  });

  // Join quiz as candidate when connected
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (!socket || !quizId || !isConnected || hasJoinedRef.current) return;

    console.log("🎓 Joining as candidate...");
    socket.emit("join_quiz", {
      quizId: numericQuizId,
      candidateName: "Candidate"
    });
    socket.once("join_quiz_ack", () => {
      hasJoinedRef.current = true;
    })
  }, [isConnected, socket, quizId]);

  // Handle quiz state updates
  useEffect(() => {
    if (quizState?.state === "active") {
      setRemainingTime(quizState.remainingTime);

      // If we have questions, update current index
      if (quizState.questions?.length > 0) {
        // If candidate has navigated previously, keep their position
        // Otherwise start from first question
        const goToQuestion = (index: number) => {
          setCurrentQuestionIndex(index);
          socket?.emit("candidate_navigated",{
            quizId : numericQuizId,
            questionNo : index,
          });
        };
      }
    }

    if (quizState?.state === "ended" && !hasSubmitted) {
      setHasSubmitted(true);

      setTimeout(() => {
        toast("Redirecting to Home Page");
        navigate("/candidate");
      }, 3000);
    }
  }, [quizState]);


  // Handle answer selection
  const handleAnswerSelect = (questionId: number, answer: string) => {
    if (lockedQuestions.has(questionId)) return;

    setLocalAnswers(prev => ({ ...prev, [questionId]: answer }));

    // Send to server
    socket?.emit("answer_saved", {
      quizId: numericQuizId,
      questionId,
      answer
    });
  };

  const lockCurrentQuestion = () => {
    const q = currentQuestion?.question_id;
    if (!q) return;

    setLockedQuestions(prev => new Set(prev).add(q));
  };

  // Handle navigation between questions
  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);

    // Notify server
    socket?.emit("candidate_navigated", {
      quizId: numericQuizId,
      questionNo: index
    });

    // Reset form for new question
    const currentQuestion = quizState?.state === "active" ? quizState.questions[index] : null;
    if (currentQuestion && localAnswers[currentQuestion.question_id]) {
      form.setValue("answer", localAnswers[currentQuestion.question_id]);
    } else {
      form.reset({ answer: "" });
    }
  };

  // Handle quiz submission
  const handleSubmitQuiz = () => {
  socket?.emit("candidate_submitted", { quizId: numericQuizId });
};

useEffect(() => {
  socket?.on("submission_confirmed", () => {
    navigate("/candidate");
  });

  return () => {
    socket?.off("submission_confirmed");
  };
}, [socket]);


  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl font-semibold mb-4">Loading quiz session...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  {
    !isConnected && (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg font-semibold">Reconnecting to quiz…</p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait, do not refresh.
          </p>
        </div>
      </div>
    )
  }


  if (quizState?.state === "draft" ||
    quizState?.state === "scheduled") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md text-center">
          <CardHeader className="text-2xl font-bold">Waiting for Quiz</CardHeader>
          <CardDescription className="mt-4">
            The quiz has not started yet. Please wait for the mentor to begin.
          </CardDescription>
          <div className="mt-6">
            <div className="animate-pulse text-blue-600">Ready to start...</div>
          </div>
        </Card>
      </div>
    );
  }

  if (quizState?.state === "paused") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md text-center">
          <CardHeader className="text-2xl font-bold text-yellow-600">Quiz Paused</CardHeader>
          <CardDescription className="mt-4">
            The mentor has paused the quiz. Please wait for it to resume.
          </CardDescription>
        </Card>
      </div>
    );
  }

  if (quizState?.state === "ended" || hasSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md text-center">
          <CardHeader className="text-2xl font-bold text-green-600">Quiz Completed</CardHeader>
          <CardDescription className="mt-4">
            {quizState?.state === "ended" && quizState.reason === "time_up"
              ? "Time's up! Quiz has been automatically submitted."
              : "Quiz has been submitted successfully."}
          </CardDescription>
          <Button className="mt-6" onClick={() => navigate("/candidate")}>
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  // Main quiz interface
  const currentQuestion = quizState?.state === "active"
    ? quizState.questions[currentQuestionIndex]
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header with Timer */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
          <div className="text-lg font-semibold">
            Quiz ID: {quizId}
          </div>
          <div className={`text-2xl font-bold ${remainingTime < 60 ? 'text-red-600' : 'text-gray-800'}`}>
            ⏱️ {formatTime(remainingTime)}
          </div>
          <Button
            onClick={handleSubmitQuiz}
            className="bg-red-600 hover:bg-red-700"
            disabled={hasSubmitted}
          >
            Submit Quiz
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-6">
        {/* Left: Question Navigation */}
        <div className="col-span-1">
          <Card className="p-4">
            <h3 className="font-bold mb-4">Questions</h3>
            <div className="grid grid-cols-5 gap-2">
              {quizState?.state === "active" && quizState.questions.map((q, idx) => (
                <button
                  key={q.question_id}
                  onClick={() => goToQuestion(idx)}
                  className={`
                    h-10 w-10 rounded-full flex items-center justify-center
                    ${currentQuestionIndex === idx
                      ? 'bg-blue-600 text-white'
                      : localAnswers[q.question_id]
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }
                  `}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Navigation</h4>
              <div className="flex gap-2">
                <Button
                  onClick={() => goToQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                  className="flex-1"
                >
                  ← Previous
                </Button>
                <Button
                  onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  disabled={currentQuestionIndex === (quizState?.state === "active" ? quizState.questions.length - 1 : 0)}
                  variant="outline"
                  className="flex-1"
                >
                  Next →
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Current Question */}
        <div className="col-span-3">
          <Card className="p-6">
            {currentQuestion && (
              <>
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">
                    Question {currentQuestionIndex + 1} of {quizState?.state === "active" ? quizState.questions.length : null}
                  </div>
                  <h2 className="text-2xl font-bold">
                    {currentQuestion.question_text}
                  </h2>
                </div>

                <Form {...form}>
                  <Controller
                    control={form.control}
                    name="answer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium">Select your answer:</FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleAnswerSelect(currentQuestion.question_id, value);
                            }}
                            className="space-y-3 mt-4"
                          >
                            {currentQuestion.options.map((option, idx) => (
                              <div
                                key={option.option_id}
                                className={`
                                  flex items-center space-x-3 p-4 border rounded-lg
                                  ${localAnswers[currentQuestion.question_id] === option.option_text
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:bg-gray-50'
                                  }
                                `}
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
                </Form>

                {/* Quick Navigation at bottom */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">
                      {localAnswers[currentQuestion.question_id]
                        ? "✓ Answer saved"
                        : "No answer selected"}
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => goToQuestion(currentQuestionIndex - 1)}
                        disabled={currentQuestionIndex === 0}
                        variant="outline"
                      >
                        ← Previous Question
                      </Button>
                      <Button
                        onClick={() => goToQuestion(currentQuestionIndex + 1)}
                        disabled={currentQuestionIndex === (quizState?.state === "active" ? quizState.questions.length - 1 : 0)}
                      >
                        Next Question →
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};