import { createOptionsFromEnum } from '@/utils/enumHelper';

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


// Type for creating a new error log
export type CreateErrorLogModel = Omit<ErrorLog, 'errorLogId'>;

// Type for updating an error log (all fields optional)
export type UpdateErrorLogModel = Partial<ErrorLog>;

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

// Generate options with custom label formatting
export const errorSeverityOptions = createOptionsFromEnum(
  ErrorLogSeverity,
  label => label // Keep as is
);

export const errorStateOptions = createOptionsFromEnum(
  ErrorLogState,
  label => label.replace(/([A-Z])/g, ' $1').trim() // Format InProgress → In Progress
);
