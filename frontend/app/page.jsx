import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to coming soon page for public access
  redirect('/coming-soon');
}
