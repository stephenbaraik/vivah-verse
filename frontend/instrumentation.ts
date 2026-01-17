import * as Sentry from '@sentry/nextjs';

// Next.js instrumentation hook for server/edge. Replaces sentry.server.config.ts.
export function register() {
  if (!process.env.SENTRY_DSN) return;

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
    release: process.env.SENTRY_RELEASE || process.env.NEXT_PUBLIC_SENTRY_RELEASE,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? '0.1'),
    profilesSampleRate: Number(process.env.SENTRY_PROFILES_SAMPLE_RATE ?? process.env.NEXT_PUBLIC_SENTRY_PROFILES_SAMPLE_RATE ?? '0.1'),
    enabled: Boolean(process.env.SENTRY_DSN),
    debug: process.env.NODE_ENV !== 'production',
  });
}