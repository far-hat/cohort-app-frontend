import { QuizState } from "@/types/liveQuizTypes";

export async function initCandidateSession(
  attemptId: number,
  quizSessionApi: any
): Promise<QuizState> {
  try {
    //  Fetch attempt (questions + answers + quiz metadata)
    const attemptRes = await quizSessionApi.getAttemptDetails(attemptId);

    if (!attemptRes?.success || !attemptRes.data) {
      throw new Error("Failed to fetch attempt");
    }

    const attempt = attemptRes.data;

    const quiz = attempt.quiz;

    const quizId = quiz.quiz_id;

    // 2️⃣ Fetch snapshot (remaining time + live state)
    const snapshotRes = await quizSessionApi.getSnapshot(quizId);

    if (!snapshotRes?.success || !snapshotRes.data) {
      throw new Error("Failed to fetch snapshot");
    }

    const snapshot = snapshotRes.data;

    // 3️⃣ Map answers array -> Record<number, number>
    const answersRecord: Record<number, number> = {};

    if (Array.isArray(attempt.answers)) {
      attempt.answers.forEach((ans: any) => {
        answersRecord[ans.question_id] = ans.option_id;
      });
    }

    // 4️⃣ Build correct union state

    if (snapshot.sessionState === "active") {
      return {
        state: "active",
        quizId,
        attemptId: attempt.attempt_id,
        start_datetime: quiz.start_datetime,
        duration: quiz.duration,
        remainingTimeMs: snapshot.remainingTime,
        questions: quiz.questions,
        answers: answersRecord,
      };
    }

    if (snapshot.sessionState === "paused") {
      return {
        state: "paused",
        quizId,
        attemptId: attempt.attempt_id,
        start_datetime: quiz.start_datetime,
        paused_at: quiz.paused_at,
        duration: quiz.duration,
        remainingTimeMs: snapshot.remainingTime,
        questions: quiz.questions,
        answers: answersRecord,
      };
    }

    // If session ended while candidate was inside
    if (snapshot.sessionState === "ended") {
      return {
        state: "ended",
        attemptId : attempt.attempt_id,
        quizId,
        ended_at: quiz.end_datetime,
        reason: "completed",
      };
    }

    // Fallback (should not realistically happen)
    return {
      state: "draft",
      quizId,
    };

  } catch (error) {
    console.error("initCandidateSession failed:", error);
    throw error;
  }
}
