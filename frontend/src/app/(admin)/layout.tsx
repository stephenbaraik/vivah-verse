'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck,
  Heart,
  IndianRupee,
  AlertTriangle,
  Settings,
  LogOut,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/vendors/pending', icon: ShieldCheck, label: 'Approvals' },
  { href: '/admin/vendors', icon: Users, label: 'Vendors' },
  { href: '/admin/weddings', icon: Heart, label: 'Weddings' },
  { href: '/admin/pricing', icon: IndianRupee, label: 'Pricing' },
  { href: '/admin/issues', icon: AlertTriangle, label: 'Issues' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-transparent flex overflow-x-hidden w-full max-w-full">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass-dark border-r border-white/10">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/vivah-logo.png"
              alt="Vivah Verse"
              width={112}
              height={28}
              className="h-7 sm:h-8 w-auto object-contain"
              priority
            />
            <span className="text-xl font-serif font-semibold text-white leading-none">
              Vivah Verse
            </span>
            <span className="text-xs bg-error/20 text-error px-2 py-0.5 rounded-full">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
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
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-error transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-transparent">
        {/* Top Bar */}
        <header className="h-16 bg-white/55 backdrop-blur-2xl border-b border-white/35 shadow-[var(--shadow-glass)] flex items-center justify-between px-6">
          <h1 className="font-serif text-xl font-semibold text-charcoal">
            Admin Console
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-white/45 transition-colors">
              <Bell className="w-5 h-5 text-charcoal" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
            </button>
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
