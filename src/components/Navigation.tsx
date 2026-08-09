'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scan, Utensils, Refrigerator, ShoppingCart, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { href: '/scan', icon: Scan, label: 'Scan' },
  { href: '/recipes', icon: Utensils, label: 'Recipes' },
  { href: '/pantry', icon: Refrigerator, label: 'Pantry' },
  { href: '/grocery', icon: ShoppingCart, label: 'Grocery' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile: Fixed bottom nav bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-charcoal/80 backdrop-blur-md border-t border-mutedAsh/20 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-full transition-colors",
                  isActive ? "text-sage" : "text-mutedAsh hover:text-charcoal dark:hover:text-oatmeal"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-full transition-all duration-300",
                  isActive ? "bg-sage text-white" : "bg-transparent"
                )}>
                  <Icon size={24} />
                </div>
                <span className={cn(
                  "text-[10px] mt-1 font-medium transition-all",
                  isActive ? "opacity-100" : "opacity-70"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop: Floating side dock */}
      <nav className="hidden md:flex flex-col fixed left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-charcoal/80 backdrop-blur-md border border-mutedAsh/20 rounded-3xl p-3 shadow-xl z-50 space-y-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-sage text-white shadow-md shadow-sage/30" 
                  : "text-mutedAsh hover:bg-sage/10 hover:text-sage dark:hover:bg-sage/20"
              )}
            >
              <Icon size={24} />
              
              {/* Tooltip */}
              <span className="absolute left-14 px-2 py-1 bg-charcoal text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap dark:bg-oatmeal dark:text-charcoal">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
