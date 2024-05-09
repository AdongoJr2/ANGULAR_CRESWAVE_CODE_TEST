export interface ApiResponseListBody<T> {
  status: 'success' | 'error';
  message: string;
  data: {
    count: number;
    pages: number;
    list: Array<T>;
  };
}
