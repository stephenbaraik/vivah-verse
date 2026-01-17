'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar,
  ClipboardList,
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VendorLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/vendor', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/vendor/listings', icon: MapPin, label: 'My Listings' },
  { href: '/vendor/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/vendor/bookings', icon: ClipboardList, label: 'Bookings' },
  { href: '/vendor/earnings', icon: CreditCard, label: 'Earnings' },
  { href: '/vendor/settings', icon: Settings, label: 'Settings' },
];

export default function VendorLayout({ children }: VendorLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-transparent flex overflow-x-hidden w-full max-w-full">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white/45 backdrop-blur-2xl border-r border-white/35 shadow-[var(--shadow-glass)]">
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/35">
          <Link href="/vendor" className="flex items-center gap-2">
            <Image 
              src="/vivah-logo.png" 
              alt="Vivah Verse" 
              width={96}
              height={24}
              className="h-6 sm:h-7 w-auto object-contain"
              priority
            />
            <span className="text-xl font-serif font-semibold text-rani leading-none">
              Vivah Verse
            </span>
            <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">
              Vendor
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors',
                      isActive
                        ? 'bg-white/45 text-rani'
                        : 'text-muted hover:bg-white/35 hover:text-charcoal'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/35">
            <button className="flex items-center gap-3 px-2 py-2 text-muted hover:text-error transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white/55 backdrop-blur-2xl border-b border-white/35 shadow-[var(--shadow-glass)] flex items-center justify-between px-4">
          <h1 className="font-serif text-xl font-semibold text-charcoal">
            Vendor Portal
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">Welcome back!</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
