export interface ApiError {
  message: string;
  code: string;
  httpStatus: string;
  data?: Record<string, unknown>;
  timeStamp: string;
  traceId: string;
}