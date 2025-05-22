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
    
  // Add the new properties to match C# model
  note?: string;                // Maps to Note in C# model
  lastUpdated?: string;         // DateTime stored as ISO string
  assignedTo?: string;          // Foreign key to AspNetUsers table
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
    
  // Add new query parameters
  lastUpdatedFrom?: string;     // DateTime stored as ISO string
  lastUpdatedTo?: string;       // DateTime stored as ISO string
  assignedToUsers?: string[];   // Maps to AssignedToUsers in C# model
}

export enum ErrorLogSeverity {
  Info = 0,
  Notice = 1,
  Warning = 2,
  Error = 3,
  Fatal = 4
}

export enum ErrorLogState {
  New = 0,
  InProgress = 1,
  Resolved = 2,
  Closed = 3
}

export const errorSeverityOptions = [
  { value: 1, label: 'Info' },
  { value: 2, label: 'Notice' },
  { value: 3, label: 'Warning' },
  { value: 4, label: 'Error' },
  { value: 5, label: 'Fatal' }
];

export const errorStateOptions = [
  { value: 0, label: 'New' },
  { value: 1, label: 'In Progress' },
  { value: 2, label: 'Resolved' },
  { value: 3, label: 'Closed' }
];
