import { useGetErrorLogsQuery } from '@/apiClients/errorLogApi';
import React from 'react';

const ErrorLogList: React.FC = () => {
  const { data: errorLogs, isLoading, error } = useGetErrorLogsQuery();
  console.log(errorLogs);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading error logs</p>;

  return (
    <ul>
      {errorLogs?.map((log: any) => (
        <li key={log.id}>
          {log.errorLogId} - {log.errorSeverity}: {log.userName}
        </li>
      ))}
    </ul>
  );
};

export default ErrorLogList;
