import type { QuestionResultVM } from '@/api/attemptResultApi';

export type ModalQuestion = {
  number: number;
  status: 'correct' | 'wrong' | 'unanswered';
  userAnswer: string | null;
  correct: string;
};

export const mapQuestionForModal = (question: QuestionResultVM): ModalQuestion => {
  const selectedOptions = question.options
    ?.filter(opt => opt.selected)
    .map(opt => opt.text)
    .join(', ') || '';

  const userAnswer = selectedOptions || question.userAnswer || null;

  return {
    number: question.order,
    status: !userAnswer
      ? 'unanswered'
      : question.isCorrect === true
        ? 'correct'
        : 'wrong',
    userAnswer,
    correct: question.correctOptions?.map(opt => opt.text).join(', ') ||
             question.correctAnswers?.join(', ') || ''
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
  number: question.order,
  status: question.isCorrect === null ? 'unanswered' : question.isCorrect ? 'correct' : 'wrong',
  userAnswer: question.userAnswer,
  correct: question.correctOptions?.[0]?.text || question.correctAnswers?.[0] || ''
});
