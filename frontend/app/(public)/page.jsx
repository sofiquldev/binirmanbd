import { redirect } from 'next/navigation';

export default function PublicHomePage() {
  // Redirect to coming soon page for now
  redirect('/coming-soon');
}

