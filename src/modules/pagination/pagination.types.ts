/**
 * Pagination types - shared interfaces for paginated API responses
 */

export interface Pagination {
  page: number;
  limit: number;
  total_pages: number;
  total_results: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: Pagination;
}

export interface PaginationParam {
  sort_by?: string;
  direction?: 'asc' | 'desc' | string;
  limit?: number;
  pick?: string; // Ex: "id created_at"
  page?: number;
  populate?: string; // Ex: "reactions"
}
