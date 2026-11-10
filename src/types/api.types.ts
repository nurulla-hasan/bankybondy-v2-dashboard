export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: PaginationMeta;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errorMessages?: Array<{
    path: string | number;
    message: string;
  }>;
  stack?: string;
}
