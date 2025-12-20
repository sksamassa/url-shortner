// src/app/[shortCode]/page.tsx
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockLinks } from '@/components/dashboard/mock-data';
import { Loader2 } from 'lucide-react';

export default function ShortLinkRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const shortCode = params.shortCode as string;

  useEffect(() => {
    if (shortCode) {
      const link = mockLinks.find((l) => l.shortCode === shortCode);
      if (link) {
        router.replace(link.originalUrl);
      } else {
        // Handle case where link is not found, maybe redirect to a 404 page
        // or the home page. For now, we'll go to the dashboard.
        router.replace('/dashboard');
      }
    }
  }, [shortCode, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <h1 className="text-xl font-semibold">Redirecting...</h1>
      <p className="text-muted-foreground">
        Please wait while we send you to your destination.
      </p>
    </div>
  );
}
