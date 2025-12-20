// src/app/[shortCode]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLinks } from '@/components/links/links-provider';
import { Loader2 } from 'lucide-react';

export default function ShortLinkRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const { links } = useLinks();
  const shortCode = params.shortCode as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We need to wait for the links to be loaded from the provider,
    // especially on the initial client-side render.
    if (links.length > 0) {
      const link = links.find((l) => l.shortCode === shortCode);
      if (link) {
        // Use replace to avoid adding the redirect page to the browser history
        router.replace(link.originalUrl);
      } else {
        // If the link is not found, redirect to the dashboard.
        // This could be a 404 page in a real application.
        router.replace('/dashboard');
      }
    }
  }, [shortCode, router, links]);
  
  // Set loading to false only if links have loaded and no link was found after the check.
  useEffect(() => {
    if (links.length > 0) {
      const link = links.find((l) => l.shortCode === shortCode);
      if (!link) {
        setLoading(false);
      }
    }
  }, [links, shortCode]);

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
