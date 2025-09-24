interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  limit: number;
  start: number;
}

interface Meta {
  pagination: Pagination;
}

interface ApiResponseType<T> {
  status: number;
  message: string;
  meta: Meta;
  data: T;
}