"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-noisy-copper text-white shadow-md z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-display tracking-wide">
          Noisy by Nature
        </h1>
        <nav className="flex gap-8 font-body text-sm uppercase tracking-wide">
          <Link
            href="#"
            className="transition-all duration-300 hover:text-noisy-cream"
          >
            Home
          </Link>
          <Link
            href="#"
            className="transition-all duration-300 hover:text-noisy-cream"
          >
            Shop
          </Link>
          <Link
            href="#"
            className="transition-all duration-300 hover:text-noisy-cream"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
