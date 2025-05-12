import { useQuery } from '@tanstack/react-query';
import React from 'react';

const ErrorLogList: React.FC = () => {
    const { data: errorLogs, isLoading, error } = useQuery({
        queryKey: ['errorLogs'],
        // consideration: fetch is one options for API calls
        // consideration: use axios directly or , you can use/look at shared/Axios or other AxiosApiBase, or AxiosApiBaseGeneric
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
