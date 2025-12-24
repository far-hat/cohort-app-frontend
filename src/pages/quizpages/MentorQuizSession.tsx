import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "@/hooks/useSocket";
import { MentorQuizDashboard } from "@/pages/quizpages/MentorQuizDashboard";
import { MentorQuizControls } from "@/pages/quizpages/MentorQuizControls";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quizSessionApi } from "@/api/QuizSessionApi";
import { QuizSocketProvider } from "@/context/QuizSocketProvider";
import { MentorQuizSessionContent } from "./MentorQuizSessionContent";

export const MentorQuizSession = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const numericQuizId = Number(quizId);
  
  return(
    <QuizSocketProvider quizId={numericQuizId}>
        <MentorQuizSessionContent quizId={numericQuizId}/>
    </QuizSocketProvider>
  )
};