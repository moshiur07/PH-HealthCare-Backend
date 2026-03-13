export interface IErrorSource {
  path: string;
  message: string;
}
export interface TErrorResponse {
  statusCode?: number;
  success: boolean;
  message: string;
  errorSources: IErrorSource[];
  error?: unknown;
  stack?: string;
}
