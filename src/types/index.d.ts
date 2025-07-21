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
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'fill_in_blank' | 'matching' | 'ordering' | 'drag_drop' | 'hotspot' | 'other';
  content: string;
  prompt: string; // Made required with default value
  points: number;
  options?: QuestionOption[];
  correctAnswer?: string | string[];
  category: string; // Required with default value
  difficulty: 'easy' | 'medium' | 'hard'; // Made required with default value
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
  info: TestInfo & {
    testCategoryId?: string;
    skillIds?: string[];
  };
  listPart: TestPart[];
  listQuestion: Question[];
  listQuestionSet: QuestionSet[];
  files?: File[];
  title?: string; // For backward compatibility
  testCategoryId?: string; // For backward compatibility
  skillIds?: string[]; // For backward compatibility
}
