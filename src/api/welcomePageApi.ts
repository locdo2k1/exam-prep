import apiClient from './axios';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface TestAttemptInfoVM {
  id: string;
  takeDate: string; // ISO string representation of Instant
  takeDateLocal: string;
  parts: string[];
  isPractice: boolean;
  correctAnswers: number;
  totalQuestions: number;
  startTime: string; // ISO string representation of Instant
  endTime: string;   // ISO string representation of Instant
  durationSeconds: number;
}

export interface TestAttemptWithNameVM extends TestAttemptInfoVM {
  testName: string;
}

/**
 * Get the latest test attempts for a user
 * @param userId The ID of the user
 * @param limit Maximum number of attempts to return (default: 2)
 * @param timezone The timezone to use for date/time formatting (e.g., "Asia/Ho_Chi_Minh")
 * @returns Promise containing the latest test attempts with test names
 */
export const getLatestTestAttempts = async (
  userId: string,
  limit: number = 2,
  timezone?: string
): Promise<ApiResponse<TestAttemptWithNameVM[]>> => {
  const params: any = { userId, limit };
  if (timezone) {
    params.timezone = timezone;
  }
  
  return await apiClient.post<ApiResponse<TestAttemptWithNameVM[]>>(
    '/test-attempts/latest',
    null,
    { params }
  );
};

const welcomePageApi = {
  getLatestTestAttempts,
};

export default welcomePageApi;
