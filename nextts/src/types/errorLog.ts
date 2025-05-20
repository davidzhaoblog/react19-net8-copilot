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


export const errorSeverityOptions = [
  { value: 0, label: 'Info' },
  { value: 8, label: 'Notice' },
  { value: 11, label: 'Warning' },
  { value: 16, label: 'Error' },
  { value: 20, label: 'Fatal' }
];

export const errorStateOptions = [
  { value: 0, label: 'New' },
  { value: 1, label: 'In Progress' },
  { value: 2, label: 'Resolved' },
  { value: 3, label: 'Closed' }
];
