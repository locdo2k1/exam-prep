/**
 * Common pagination interface
 */
export interface Pageable {
  page?: number;
  size?: number;
  sort?: string;
  [key: string]: any; // For additional query parameters
}

/**
 * Page response interface
 */
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
