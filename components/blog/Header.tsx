'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: 'https://hexpertify.vercel.app/' },
    { label: 'My Profile', href: 'https://hexpertify.vercel.app/profile' },
    { label: 'Blog', href: '/blog' },
    { label: 'Services', href: 'https://hexpertify.vercel.app/#categories' },
    { label: 'About Us', href: 'https://hexpertify.vercel.app/about-us' },
    { label: 'Contact Us', href: 'https://hexpertify.vercel.app/contact-us' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/purple_logo.jpeg"
                alt="Expertify Logo"
                width={314}
                height={80}
                className="h-16 w-auto cursor-pointer"
                priority
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-700 transition-colors text-sm font-bold"
                style={{ transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#450BC8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-700 transition-colors text-sm font-bold"
                  style={{ transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#450BC8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
