import DeleteErrorLogClient from './DeleteErrorLogClient';

interface DeleteErrorLogPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function DeleteErrorLogPage({ params }: DeleteErrorLogPageProps) {
  const { locale, id } = await params;
  const errorLogId = parseInt(id);
  
  // Return the client component that will handle the deletion with a loading spinner
  return <DeleteErrorLogClient errorLogId={errorLogId} locale={locale} />;
}