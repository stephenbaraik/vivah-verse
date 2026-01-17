'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Search, 
  Calendar, 
  Heart, 
  User,
  MessageCircle,
  Sparkles,
  BookOpen,
  Phone,
  LogIn
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { AuthModal } from '@/components/auth';
import { cn } from '@/lib/utils';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');
  const isHome = pathname === '/';

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/55 backdrop-blur-2xl border-b border-white/35 shadow-[var(--shadow-glass)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <Image
              src="/vivah-logo.png"
              alt="Vivah Verse"
              width={96}
              height={24}
              sizes="96px"
              className="h-6 sm:h-7 w-auto object-contain shrink-0"
              priority
            />
            <span className="hidden sm:block text-lg sm:text-xl font-serif font-semibold text-rani leading-none truncate">
              Vivah Verse
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/venues" 
              className={cn(
                "transition-colors",
                isActive('/venues') ? 'text-rani font-medium' : 'text-charcoal hover:text-rani'
              )}
            >
              Venues
            </Link>
            <Link
              href="/packages"
              className={cn(
                'transition-colors',
                isActive('/packages') ? 'text-rani font-medium' : 'text-charcoal hover:text-rani'
              )}
            >
              Packages
            </Link>
            <Link
              href="/services"
              className={cn(
                'transition-colors',
                isActive('/services') ? 'text-rani font-medium' : 'text-charcoal hover:text-rani'
              )}
            >
              Services
            </Link>
            <Link
              href="/real-weddings"
              className={cn(
                'transition-colors',
                isActive('/real-weddings') ? 'text-rani font-medium' : 'text-charcoal hover:text-rani'
              )}
            >
              Real Weddings
            </Link>
            <Link
              href="/blog"
              className={cn(
                'transition-colors',
                isActive('/blog') ? 'text-rani font-medium' : 'text-charcoal hover:text-rani'
              )}
            >
              Blog
            </Link>
            <Link 
              href="/concierge" 
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                isActive('/concierge') ? 'text-rani font-medium' : 'text-charcoal hover:text-rani'
              )}
            >
              <MessageCircle className="w-4 h-4" />
              AI Concierge
            </Link>
            {isAuthenticated && (
              <Link 
                href="/dashboard" 
                className={cn(
                  "transition-colors",
                  isActive('/dashboard') ? 'text-rani font-medium' : 'text-charcoal hover:text-rani'
                )}
              >
                My Wedding
              </Link>
            )}
          </nav>

          {/* Mobile quick links (header) */}
          <div className="md:hidden flex items-center gap-1.5">
            <Link
              href="/venues"
              className={cn(
                'p-2 rounded-lg transition-colors',
                isActive('/venues') ? 'bg-rose-soft text-rani' : 'text-charcoal hover:bg-rose-soft'
              )}
              aria-label="Browse venues"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/concierge"
              className={cn(
                'p-2 rounded-lg transition-colors',
                isActive('/concierge') ? 'bg-rose-soft text-rani' : 'text-charcoal hover:bg-rose-soft'
              )}
              aria-label="AI concierge"
            >
              <MessageCircle className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link 
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-soft hover:bg-rani/10 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-rani/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-rani" />
                </div>
                <span className="text-sm font-medium text-charcoal hidden sm:block">
                  {user?.name?.split(' ')[0] || 'Account'}
                </span>
              </Link>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rani text-white hover:bg-rani/90 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm font-medium">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={cn(
          isHome
            ? 'max-w-7xl mx-auto w-full px-0 py-0 pb-24 md:pb-0'
            : 'max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6'
        )}
      >
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-10 bg-white border-t border-divider full-bleed">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <Image
                  src="/vivah-logo.png"
                  alt="Vivah Verse"
                  width={120}
                  height={30}
                  className="h-7 w-auto object-contain"
                />
                <span className="text-lg font-serif font-semibold text-rani leading-none">
                  Vivah Verse
                </span>
              </div>
              <p className="mt-3 text-sm text-charcoal/70 max-w-sm">
                Discover venues, compare options, and plan your wedding with confidence.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Link
                  href="/concierge"
                  className="inline-flex items-center gap-2 text-sm font-medium text-rani hover:text-rani/80"
                >
                  <Sparkles className="w-4 h-4" />
                  Try AI Concierge
                </Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-charcoal">Explore</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link className="text-charcoal/70 hover:text-rani" href="/venues">Venues</Link></li>
                <li><Link className="text-charcoal/70 hover:text-rani" href="/venues/collections">Destinations</Link></li>
                <li><Link className="text-charcoal/70 hover:text-rani" href="/packages">Packages</Link></li>
                <li><Link className="text-charcoal/70 hover:text-rani" href="/services">Services</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-charcoal">Company</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link className="text-charcoal/70 hover:text-rani" href="/about">About</Link></li>
                <li><Link className="text-charcoal/70 hover:text-rani" href="/blog">Blog</Link></li>
                <li><Link className="text-charcoal/70 hover:text-rani" href="/real-weddings">Real Weddings</Link></li>
                <li>
                  <Link className="text-charcoal/70 hover:text-rani inline-flex items-center gap-2" href="/contact">
                    <Phone className="w-4 h-4" />
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-charcoal">Legal</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link className="text-charcoal/70 hover:text-rani" href="/terms">Terms</Link></li>
                <li><Link className="text-charcoal/70 hover:text-rani" href="/privacy">Privacy</Link></li>
                <li><Link className="text-charcoal/70 hover:text-rani" href="/help">Help</Link></li>
                <li>
                  <Link className="text-charcoal/70 hover:text-rani inline-flex items-center gap-2" href="/vendor">
                    <BookOpen className="w-4 h-4" />
                    Vendor portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-divider flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-charcoal/60">
            <p>© {new Date().getFullYear()} Vivah Verse. All rights reserved.</p>
            <p>Made for modern Indian weddings.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-divider z-40 pb-safe">
        <div className="flex items-center justify-around h-16">
          <Link 
            href="/" 
            className={cn(
              "flex flex-col items-center gap-1",
              isActive('/') && pathname === '/' ? 'text-rani' : 'text-muted hover:text-rani'
            )}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link 
            href="/venues" 
            className={cn(
              "flex flex-col items-center gap-1",
              isActive('/venues') ? 'text-rani' : 'text-muted hover:text-rani'
            )}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Venues</span>
          </Link>
          <Link 
            href="/concierge" 
            className={cn(
              "flex flex-col items-center gap-1",
              isActive('/concierge') ? 'text-rani' : 'text-muted hover:text-rani'
            )}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">AI Help</span>
          </Link>
          {isAuthenticated ? (
            <>
              <Link 
                href="/dashboard" 
                className={cn(
                  "flex flex-col items-center gap-1",
                  isActive('/dashboard') ? 'text-rani' : 'text-muted hover:text-rani'
                )}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-xs">Wedding</span>
              </Link>
              <Link 
                href="/profile" 
                className={cn(
                  "flex flex-col items-center gap-1",
                  isActive('/profile') ? 'text-rani' : 'text-muted hover:text-rani'
                )}
              >
                <User className="w-5 h-5" />
                <span className="text-xs">Profile</span>
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/favorites" 
                className={cn(
                  "flex flex-col items-center gap-1",
                  isActive('/favorites') ? 'text-rani' : 'text-muted hover:text-rani'
                )}
              >
                <Heart className="w-5 h-5" />
                <span className="text-xs">Saved</span>
              </Link>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="flex flex-col items-center gap-1 text-muted hover:text-rani"
              >
                <LogIn className="w-5 h-5" />
                <span className="text-xs">Sign In</span>
              </button>
            </>
          )}
        </div>
      </nav>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
