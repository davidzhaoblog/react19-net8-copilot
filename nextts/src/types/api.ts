// src/types/api.ts
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  pageIndex: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}