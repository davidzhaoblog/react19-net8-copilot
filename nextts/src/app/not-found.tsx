// src/app/not-found.tsx
import { redirect } from 'next/navigation';

export default function NotFound() {
  // Redirect to default locale for not found pages
  redirect('/en');
}
