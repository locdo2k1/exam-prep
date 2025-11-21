import type { QuestionResultVM, OptionResultVM, QuestionAudioVM } from "@/api/attemptResultApi";

export type ModalQuestion = {
  context: string;
  number: number;
  status: "correct" | "wrong" | "unanswered";
  // For text answers this is the user's input, for options it's a comma joined string
  userAnswer: string | null;
  // Human readable single-line correct summary (kept for compatibility)
  correct: string;
  // Full shapes for richer rendering in the modal
  options?: OptionResultVM[];
  correctOptions?: OptionResultVM[];
  correctAnswers?: string[];
  // Selected options (full objects) for easier rendering
  selectedOptions?: OptionResultVM[];
  transcript?: string;
  outerContent?: string;
  explanation?: string;
  // Audio files associated with the question
  questionAudios?: QuestionAudioVM[];
  // Question type for determining how to display options
  questionType?: string;
};

export const mapQuestionForModal = (question: QuestionResultVM): ModalQuestion => {
  const selectedObjs = question.options?.filter((opt) => opt.selected) || [];
  const selectedOptionsText = selectedObjs.map((o) => o.text).join(", ");
  const userAnswer = selectedOptionsText || question.userAnswer || null;

  return {
    context: question.context || "",
    number: question.order,
    status: !userAnswer ? "unanswered" : question.isCorrect === true ? "correct" : "wrong",
    userAnswer,
    correct: question.correctOptions?.map((opt) => opt.text).join(", ") || question.correctAnswers?.join(", ") || "",
    options: question.options || [],
    correctOptions: question.correctOptions || [],
    correctAnswers: question.correctAnswers || [],
    selectedOptions: selectedObjs,
    transcript: question.transcript,
    outerContent: question.outerContent,
    explanation: question.explanation,
    questionAudios: question.questionAudios || [],
    questionType: (question as any).questionType,
  };
};

// A minimal shape used by AnalysisTabs for displaying question pills
export type MinimalAnalysisQuestion = {
  order: number;
  isCorrect: boolean | null;
  userAnswer: string | null;
  correctOptions?: { text: string }[];
  correctAnswers?: string[];
};

// Map question to a lightweight display shape for AnalysisTabs
export const mapQuestionForDisplay = (question: MinimalAnalysisQuestion): ModalQuestion => ({
  context: "",
  number: question.order,
  status: question.isCorrect === null ? "unanswered" : question.isCorrect ? "correct" : "wrong",
  userAnswer: question.userAnswer,
  correct: question.correctOptions?.[0]?.text || question.correctAnswers?.[0] || "",
  // Convert minimal correctOptions shape to OptionResultVM-like objects for consistent rendering
  options: question.correctOptions
    ? question.correctOptions.map((o) => ({ id: "", text: o.text, selected: false, isCorrect: true }))
    : undefined,
  correctOptions: question.correctOptions
    ? question.correctOptions.map((o) => ({ id: "", text: o.text, selected: false, isCorrect: true }))
    : undefined,
  correctAnswers: question.correctAnswers || undefined,
  selectedOptions: [],
});
