import apiClient from "./axios";

export interface TestResultOverallVM {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  accuracyPercentage: number;
  score: number;
  completionTime: string; // format: HH:mm:ss
  attemptedQuestions: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
  errors?: Record<string, string[]>;
}

// Test info for an attempt
export interface TestInfoVM {
  testName: string;
  partNames: string[];
}

export interface OptionResultVM {
  /** ID of the option */
  id: string;
  /** Display text of the option */
  text: string;
  /** Indicates if this option was selected by the user */
  isSelected: boolean;
  /** Indicates if this option is a correct answer */
  isCorrect: boolean;
}

export interface QuestionResultVM {
  /** Order of the question in the test */
  order: number;
  /** Context or instructions for the question */
  context?: string;
  /** Explanation for the correct answer */
  explanation?: string;
  /** Transcript for audio/video questions */
  transcript?: string;
  /** Indicates if the user's answer is correct */
  isCorrect?: boolean;
  /** List of correct options for multiple-choice questions */
  correctOptions?: OptionResultVM[];
  /** List of correct answers for text-based questions */
  correctAnswers?: string[];
  /** User's answer for text-based questions */
  userAnswer?: string;
  /** All available options for the question */
  options?: OptionResultVM[];
  /** List of categories this question belongs to */
  questionCategories?: string[];
}

export interface AnalysisQuesCategory {
  /** Name of the question category */
  categoryName: string;
  /** Number of correct answers in this category */
  correctNumber: number;
  /** Number of incorrect answers in this category */
  incorrectNumber: number;
  /** Number of skipped questions in this category */
  skipNumber: number;
  /** Accuracy percentage for this category */
  accuracy: number;
  /** List of question results in this category */
  questions: QuestionResultVM[];
}

export interface AnalysisPartVM {
  /** Order of the test part */
  order: number;
  /** Name of the test part (e.g., "Listening", "Reading") */
  partName: string;
  /** Overall analysis by question categories */
  categories: AnalysisQuesCategory[];
}

export interface AnalysisQuestionsVM {
  /** List of test parts with their analysis */
  parts: AnalysisPartVM[];
  /** Overall analysis by question categories */
  overall: AnalysisQuesCategory[];
}

/**
 * Get overall test results for a specific test and attempt
 * @param attemptId - The ID of the specific attempt
 * @returns Promise containing the test result data
 */
export const getTestResultOverall = async (
  attemptId: string
): Promise<ApiResponse<TestResultOverallVM>> => {
  return apiClient.get(`/tests/results/overall/${attemptId}`);
};

/**
 * Get test name and part names for a specific test attempt
 * @param attemptId - The ID of the specific attempt
 * @returns Promise containing the test info (name and part names)
 */
export const getTestInfo = async (
  attemptId: string
): Promise<ApiResponse<TestInfoVM>> => {
  return apiClient.get(`/attempts/${attemptId}/test-info`);
};

/**
 * Get detailed analysis for a specific test attempt
 * @param attemptId - The ID of the specific attempt
 * @returns Promise containing the detailed analysis including question-wise performance,
 *          time spent, and skill-wise breakdown
 */
export const getTestAttemptAnalysis = async (
  attemptId: string
): Promise<ApiResponse<AnalysisQuestionsVM>> => {
  return apiClient.get(`/attempts/${attemptId}/analysis`);
};
