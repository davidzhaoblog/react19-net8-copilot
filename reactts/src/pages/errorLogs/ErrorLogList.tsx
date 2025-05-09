import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';

const ErrorLogList: React.FC = () => {

    const queryClient = useQueryClient();
    const { data: errorLogs, isLoading, error } = useQuery({
        queryKey: ['errorLogs'],
        queryFn: () => fetch('https://localhost:7260/api/errorlog').then(res => res.json()),
    });


    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading error logs</p>;

    return (
        <ul>
            {errorLogs?.map((log: any) => (
                <li key={log.errorLogId}>
                    {log.errorLogId} - {log.errorSeverity}: {log.userName}
                </li>
            ))}
        </ul>
    );
};

export default ErrorLogList;
