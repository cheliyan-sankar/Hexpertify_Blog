'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import blogImg from '../../assets/uploads/blogs/blog.jpeg';

export default function Header() {
  const [open, setOpen] = useState(false);

  const menu = [
    { label: 'Home', href: 'https://hexpertify.com/' },
    { label: 'Blogs', href: 'https://hexpertify.com/blogs' },
    { label: 'Services', href: 'https://hexpertify.com/services' },
    { label: 'About Us', href: 'https://hexpertify.com/about-us' },
    { label: 'Contact Us', href: 'https://hexpertify.com/contact-us' },
  ];

  return (
    <header className="relative bg-white shadow-[0_4px_4px_3px_rgba(0,0,0,0.25)] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center gap-4 pl-0">
            <Link href="/" className="pointer-events-auto">
              <Image
                src={blogImg}
                alt="Hexpertify"
                title="Hexpertify"
                width={300}
                height={60}
                className="h-[40px] md:h-[60px] w-auto object-contain cursor-pointer"
                priority
              />
            </Link>
          </div>

          <section className="hidden md:flex justify-center items-center gap-[30px]">
            <ul className="flex menuText gap-[40px] cursor-pointer items-center">
              {menu.map((m) => (
                <li key={m.href}>
                  <Link href={m.href} className="font-bold hover:text-[#450bc8]">
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>

            
          </section>

          <div className="md:hidden flex items-center z-50">
            <button
              onClick={() => setOpen(true)}
              className="text-gray-700 focus:outline-none"
              aria-label="Open menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${open ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[75%] sm:w-[60%] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col p-6 h-full overflow-y-auto">
          <div className="flex justify-end mb-8">
            <button className="text-gray-700 hover:text-red-500 transition-colors" onClick={() => setOpen(false)} aria-label="Close menu">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <ul className="flex flex-col gap-6 text-lg font-medium text-gray-800">
            {menu.map((m) => (
              <li key={m.href}>
                <Link href={m.href} className="font-bold hover:text-[#450bc8] transition-colors" onClick={() => setOpen(false)}>
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>

          
        </div>
      </div>
    </header>
  );
}
