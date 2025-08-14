import apiClient from './axios';

const API_PATH = '/practice-tests';

/**
 * API Response Type
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface TestAttemptVM {
  id: string;
  testId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'GRADED';
}

export interface TestPartAttemptVM {
  id: string;
  testAttemptId: string;
  testPartId: string;
  startedAt: string;
  submittedAt?: string;
  score?: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED';
}

export interface PracticeTestResultVM {
  testAttemptId: string;
  testId: string;
  userId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  completedAt: string;
  partResults: Array<{
    partId: string;
    score: number;
    maxScore: number;
    percentage: number;
  }>;
}

export interface PracticeTestVM {
  testId: string;
  testName: string;
  parts: PracticePartVM[];
  questionAndQuestionSet: PracticeQuestionAndQuestionSetVM[];
}

export interface PracticePartVM {
  id: string;
  name: string;
  description?: string;
  questionsAndQuestionSets: PracticeQuestionAndQuestionSetVM[];
}

export interface PracticeQuestionAndQuestionSetVM {
  id: string;
  order: number;
  questionSet?: PracticeQuestionSetVM;
  question?: PracticeQuestionVM;
}

export interface PracticeQuestionSetVM {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  questions: PracticeQuestionVM[];
  order: number;
  totalQuestions: number;
  totalScore: number;
}

export interface PracticeQuestionVM {
  id: string;
  text: string;
  questionType: string;
  score: number | null;
  order: number;
  options: PracticeOptionVM[];
  questionAudios: PracticeFileInfoVM[];

  // Alias for text to match Java getter
  prompt?: string;
}

export interface PracticeOptionVM {
  id: string;
  text: string;
  isCorrect?: boolean;
  // Add other properties from your Java PracticeOptionVM
}

export interface PracticeFileInfoVM {
  id: string;
  url: string;
  name: string;
  size: number;
  // Add other properties from your Java PracticeFileInfoVM
}

export interface PracticeTestRequest {
  testId: string;
  partIds?: string[];
}

export interface QuestionAnswerRequest {
  questionId: string;
  selectedOptionIds?: string[];
  answerText?: string;
}

interface SubmitPracticeTestPartRequest {
  testId: string;
  userId: string;
  questionAnswers: QuestionAnswerRequest[];
  listPartId: string[];
  duration: number;
}

/**
 * Start a new practice test
 * @param testId - The ID of the test to practice
 * @param userId - The ID of the user starting the practice
 * @returns The started test attempt
 */
export const startPracticeTest = async (
  testId: string,
  userId: string
): Promise<ApiResponse<TestAttemptVM>> => {
  const response = await apiClient.post<ApiResponse<TestAttemptVM>>(
    `${API_PATH}/${testId}/start`,
    null,
    { params: { userId } }
  );
  return response.data;
};

/**
 * Get all part attempts for a test attempt
 * @param testAttemptId - The ID of the test attempt
 * @returns List of test part attempts
 */
export const getTestPartAttempts = async (
  testAttemptId: string
): Promise<ApiResponse<TestPartAttemptVM[]>> => {
  const response = await apiClient.get<ApiResponse<TestPartAttemptVM[]>>(
    `${API_PATH}/attempts/${testAttemptId}/parts`
  );
  return response.data;
};

/**
 * Get practice test results
 * @param testAttemptId - The ID of the test attempt
 * @param userId - The ID of the user requesting the results
 * @returns The practice test results
 */
export const getPracticeTestResults = async (
  testAttemptId: string,
  userId: string
): Promise<ApiResponse<PracticeTestResultVM>> => {
  const response = await apiClient.get<ApiResponse<PracticeTestResultVM>>(
    `${API_PATH}/attempts/${testAttemptId}/results`,
    { params: { userId } }
  );
  return response.data;
};

/**
 * Get practice test by ID
 * @param testId - The ID of the test
 * @returns The practice test details
 */
export const getPracticeTestById = async (testId: string): Promise<ApiResponse<PracticeTestVM>> => {
  const response = await apiClient.get<ApiResponse<PracticeTestVM>>(`${API_PATH}/${testId}`);
  return response.data;
};

/**
 * Get practice parts for a test
 * @param testId - The ID of the test
 * @returns List of practice parts for the test
 */
export const getPracticeParts = async (testId: string): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(
    `${API_PATH}/tests/${testId}/parts`
  );
  return response.data;
};

/**
 * Get practice test data for specific parts of a test
 * @param testId - The ID of the test
 * @param partIds - Optional array of part IDs to include in the practice test
 * @returns The practice test data with the requested parts
 */
export const getPracticeTestByParts = async (
  testId: string,
  partIds?: string[]
): Promise<ApiResponse<PracticeTestVM>> => {
  const requestBody: PracticeTestRequest = { testId, partIds };
  return await apiClient.post(
    `${API_PATH}/tests/${testId}/practice`,
    requestBody
  );
};

/**
 * Submit a practice test part
 * @param testId - The ID of the test
 * @param userId - The ID of the user submitting the attempt
 * @param questionAnswers - Array of question answers
 * @param partIds - Array of part IDs included in this submission
 * @param duration - Duration of the test part in seconds
 * @returns The submitted test attempt
 */
export const submitPracticeTestPart = async (
  testId: string,
  userId: string,
  questionAnswers: QuestionAnswerRequest[],
  partIds: string[],
  duration: number
): Promise<ApiResponse<TestAttemptVM>> => {
  const requestBody: SubmitPracticeTestPartRequest = {
    testId,
    userId,
    questionAnswers,
    listPartId: partIds,
    duration
  };

  return await apiClient.post(
    `${API_PATH}/attempts/submit`,
    requestBody
  );
};
