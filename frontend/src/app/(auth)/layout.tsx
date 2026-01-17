import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Search } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-transparent flex flex-col overflow-x-hidden w-full max-w-full">
      {/* Simple top nav (auth pages) */}
      <header className="sticky top-0 z-40 bg-white/55 backdrop-blur-2xl border-b border-white/35 shadow-[var(--shadow-glass)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <Image
              src="/vivah-logo.png"
              alt="Vivah Verse"
              width={112}
              height={28}
              sizes="112px"
              className="h-7 sm:h-8 w-auto object-contain shrink-0"
              priority
            />
            <span className="hidden sm:block text-lg font-serif font-semibold text-rani leading-none truncate">
              Vivah Verse
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/venues"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-charcoal hover:bg-white/45 transition-colors"
            >
              <Search className="w-4 h-4" />
              Venues
            </Link>
            <Link
              href="/concierge"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-charcoal hover:bg-white/45 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              AI Concierge
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex-1 flex overflow-x-hidden w-full max-w-full">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-rani to-rani-dark items-center justify-center p-8 xl:p-12">
        <div className="text-center text-white max-w-md">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image 
              src="/vivah-logo.png" 
              alt="Vivah Verse" 
              width={176}
              height={48}
              className="h-11 xl:h-12 w-auto object-contain"
              priority
            />
            <h1 className="text-3xl xl:text-4xl font-serif font-semibold leading-none">
              Vivah Verse
            </h1>
          </div>
          <p className="text-base xl:text-lg text-white/80 mb-6 xl:mb-8">
            Your perfect wedding, beautifully planned
          </p>
          <div className="space-y-3 xl:space-y-4 text-left text-sm xl:text-base">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                ✨
              </div>
              <span>AI-powered venue recommendations</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                🏛️
              </div>
              <span>500+ verified venues across India</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                💳
              </div>
              <span>Secure payments with Razorpay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      </div>

      <footer className="bg-white/45 backdrop-blur-2xl border-t border-white/35">
        <div className="max-w-7xl mx-auto px-4 py-6 text-xs text-charcoal/60 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Vivah Verse. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link className="hover:text-rani" href="/terms">Terms</Link>
            <Link className="hover:text-rani" href="/privacy">Privacy</Link>
            <Link className="hover:text-rani" href="/help">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
