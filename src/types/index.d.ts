// Common types for the application

// Question Option
export interface QuestionOption {
  id: string;
  text: string;
  correct: boolean;
}

// Question
export interface Question {
  id: string;
  type: string;
  content: string;
  prompt: string; // Made required with default value
  points: number;
  options?: QuestionOption[];
  correctAnswer?: string | string[];
  category: string; // Required with default value
  difficulty: "easy" | "medium" | "hard"; // Made required with default value
  duration: number; // Made required with default value
  explanation: string; // Made required with default value
  tags: string[]; // Made required with default value
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // For any additional properties
}

// Question Set
export interface QuestionSet {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
  order?: number;
  questionCount?: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Test Part
export interface TestPart {
  id: string;
  name: string;
  title: string;
  description: string;
  instruction?: string;
  order: number;
  duration: number;
  questions: Question[];
  questionSets?: QuestionSet[];
  listQuestionAndQuestionSet: Array<Question | QuestionSet>;
  createdAt?: string;
  updatedAt?: string;
}

// Test Information
export interface TestInfo {
  id?: string;
  name: string;
  description: string;
  duration: number;
  passingScore: number;
  maxAttempts: number;
  isPublished: boolean;
  startTime?: string;
  endTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Test View Model
export interface TestVM {
  testCategoryId?: string;
  skillIds?: string[];
  id?: string;
  listPart: TestPart[];
  listQuestionAndQuestionSet: Array<Question | QuestionSet>;
  files?: File[];
  audioFile?: File | null;
  title?: string; // For backward compatibility
  testCategoryId?: string; // For backward compatibility
  skillIds?: string[]; // For backward compatibility
  duration?: number; // For backward compatibility
}
