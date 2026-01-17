'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] px-4 py-16">
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-charcoal">Page not found</h1>
        <p className="mt-2 text-sm text-charcoal/70">
          The page you’re looking for doesn’t exist or may have moved.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" className="gap-2" onClick={() => router.push('/venues')}>
            <Search className="h-4 w-4" />
            Browse venues
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
