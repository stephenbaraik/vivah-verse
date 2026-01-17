'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Keep this lightweight; real error reporting can be added later.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] px-4 py-16">
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-charcoal">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-charcoal/70">
          Please try again. If the issue persists, refresh the page.
        </p>
        {error.digest ? (
          <p className="mt-4 text-xs text-charcoal/50">Error ID: {error.digest}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => router.push('/')}
          >
            <Home className="h-4 w-4" />
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
