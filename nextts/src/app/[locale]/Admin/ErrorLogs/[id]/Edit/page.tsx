import { Metadata } from 'next';
import ErrorLogEditClient from './ErrorLogEditClient';
import { getServerErrorLog } from '@/services/ErrorLogService';
import { use } from 'react';
import { MetadataDebugger } from '@/components/MetadataDebugger';


interface ErrorLogEditPageProps {
    params: Promise<{
        locale: string;
        id: string;
    }>;
}


// Server component features go here
export async function generateMetadata({ params }: ErrorLogEditPageProps): Promise<Metadata> {
    const { id } = await params;
    const errorLog = await getServerErrorLog(parseInt(id));

    return {
        title: `Edit Error #${id} - Admin Dashboard`,
        description: `Edit error log #${id}: ${errorLog.errorMessage.substring(0, 100)}...`,
        robots: {
            index: false, // Don't index edit pages
            follow: true,
        }
    }
}

// Server component that renders the client component
export default function ErrorLogEditPage({ params }: ErrorLogEditPageProps) {
    // Just pass the params to the client component
    return <>
        <ErrorLogEditClient params={params} />
        <MetadataDebugger />
    </>;
}