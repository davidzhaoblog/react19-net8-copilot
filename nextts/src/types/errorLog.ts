// src/types/errorLog.ts
export interface ErrorLog {
  errorLogId: number;
  errorTime: string;
  userName: string;
  errorNumber: number;
  errorSeverity?: number;
  errorState?: number;
  errorProcedure?: string;
  errorLine?: number;
  errorMessage: string;
}

export interface ErrorLogQuery {
  text?: string;
  errorTimeFrom?: string;
  errorTimeTo?: string;
  errorSeverities?: number[];
  errorStates?: number[];
  pageSize?: number;
  pageIndex?: number;
  orderBy?: string;
}