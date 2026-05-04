"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, Mail, Menu, ShoppingCart, X, Youtube } from "lucide-react";

type SiteNavProps = {
  onContact?: () => void;
  contactHref?: string;
  joinHref?: string;
  showHomeInMobileMenu?: boolean;
};

const instagramUrl = "https://instagram.com/noisy_by_nature_lab";
const youtubeUrl = "https://youtube.com/@noisybynaturelab?si=ETY3HemnXUXxQ9z9";

export default function SiteNav({
  onContact,
  contactHref = "mailto:contact@noisybynature.eu",
  joinHref = "/#join-list",
  showHomeInMobileMenu = true,
}: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleContact = () => {
    setMenuOpen(false);
    if (onContact) {
      onContact();
      return;
    }
    window.location.href = contactHref;
  };

  return (
    <header className="relative z-[80] mx-auto w-full max-w-7xl px-6 py-3 md:px-10 lg:px-14 lg:py-5">
      <div className="hidden items-center justify-between gap-6 lg:flex">
        <nav className="flex items-center gap-4 text-[0.58rem] uppercase tracking-[0.22em] text-[#d6a066]/76 md:gap-7 md:text-[0.62rem]">
          <Link href="/" className="transition-colors hover:text-[#d6b071]">
            Home
          </Link>
          <Link href="/shop" className="transition-colors hover:text-[#d6b071]">
            Shop
          </Link>
          <div className="nav-menu relative">
            <Link href="/#controllers" className="transition-colors hover:text-[#d6b071]">
              Controllers
            </Link>
            <div className="nav-dropdown pointer-events-none absolute left-1/2 top-full z-30 mt-3 min-w-28 border border-[#8f5c32]/20 bg-[#120c08]/92 px-4 py-3 text-left opacity-0 shadow-[0_18px_42px_rgba(0,0,0,0.38)] backdrop-blur-md transition-all duration-150 ease-out">
              <div className="flex flex-col gap-3 text-[0.56rem] tracking-[0.2em] text-[#d9ad75]/76">
                <Link href="/fad3rs" className="whitespace-nowrap transition-colors hover:text-[#efd1a2]">
                  FAD3RS
                </Link>
                <Link href="/mast3r" className="whitespace-nowrap transition-colors hover:text-[#efd1a2]">
                  MAST3R
                </Link>
              </div>
            </div>
          </div>
          <div className="nav-menu relative">
            <Link href="/shop/cases" className="transition-colors hover:text-[#d6b071]">
              Cases
            </Link>
            <div className="nav-dropdown pointer-events-none absolute left-1/2 top-full z-30 mt-3 min-w-36 border border-[#8f5c32]/20 bg-[#120c08]/92 px-4 py-3 text-left opacity-0 shadow-[0_18px_42px_rgba(0,0,0,0.38)] backdrop-blur-md transition-all duration-150 ease-out">
              <div className="flex flex-col gap-3 text-[0.56rem] tracking-[0.2em] text-[#d9ad75]/76">
                <Link href="/shop/cases" className="whitespace-nowrap transition-colors hover:text-[#efd1a2]">
                  In Stock Cases
                </Link>
                <Link href="/bespoke" className="whitespace-nowrap transition-colors hover:text-[#efd1a2]">
                  Bespoke
                </Link>
              </div>
            </div>
          </div>
          <Link href="/#modules" className="transition-colors hover:text-[#d6b071]">
            Modules
          </Link>
          <Link href="/workshop" className="transition-colors hover:text-[#d6b071]">
            Workshop
          </Link>
        </nav>

        <nav className="flex items-center gap-3 whitespace-nowrap text-[0.56rem] uppercase tracking-[0.18em] text-[#d6a066]/76 md:gap-5 md:text-[0.6rem]">
          <Link href="/cart" aria-label="Cart" className="transition-colors hover:text-[#d6b071]">
            <ShoppingCart className="h-3.5 w-3.5" strokeWidth={1.65} />
          </Link>
          <Link href={joinHref} className="transition-colors hover:text-[#d6b071]">
            Join List
          </Link>
          <button onClick={handleContact} className="transition-colors hover:text-[#d6b071]">
            Contact
          </button>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="text-[#d6a066]/76 transition-colors hover:text-[#d6b071]"
          >
            <Instagram className="h-3.5 w-3.5" strokeWidth={1.6} />
          </a>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="text-[#d6a066]/76 transition-colors hover:text-[#d6b071]"
          >
            <Youtube className="h-4 w-4" strokeWidth={1.6} />
          </a>
        </nav>
      </div>

      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="inline-flex h-9 w-9 -translate-y-0.5 items-center justify-center text-[#d6a066]/82 transition-colors hover:text-[#efd1a2]"
        >
          {menuOpen ? <X className="h-4 w-4" strokeWidth={1.6} /> : <Menu className="h-4 w-4" strokeWidth={1.6} />}
        </button>

        <div aria-hidden="true" />

        <div className="flex items-center justify-end gap-3 text-[0.56rem] uppercase tracking-[0.18em] text-[#d6a066]/78">
          <Link href="/shop" aria-label="Shop" className="transition-colors hover:text-[#d6b071]">
            <ShoppingCart className="h-3.5 w-3.5" strokeWidth={1.65} />
          </Link>
          <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="transition-colors hover:text-[#d6b071]">
            <Instagram className="h-3.5 w-3.5" strokeWidth={1.6} />
          </a>
          <a href={youtubeUrl} target="_blank" rel="noreferrer" aria-label="YouTube" className="transition-colors hover:text-[#d6b071]">
            <Youtube className="h-4 w-4" strokeWidth={1.6} />
          </a>
          {onContact ? (
            <button type="button" onClick={handleContact} aria-label="Contact" className="transition-colors hover:text-[#d6b071]">
              <Mail className="h-3.5 w-3.5" strokeWidth={1.6} />
            </button>
          ) : (
            <a href={contactHref} aria-label="Contact" className="transition-colors hover:text-[#d6b071]">
              <Mail className="h-3.5 w-3.5" strokeWidth={1.6} />
            </a>
          )}
        </div>
      </div>

      <div
        className={`lg:hidden ${
          menuOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        } fixed left-6 top-[3.65rem] z-[100] w-[min(21rem,calc(100vw-3rem))] border border-[#8f5c32]/20 bg-[#120c08]/96 px-5 py-4 shadow-[0_18px_42px_rgba(0,0,0,0.38)] backdrop-blur-md transition duration-150 ease-out`}
      >
        <nav className="flex flex-col gap-3 text-[0.66rem] uppercase tracking-[0.22em] text-[#d9ad75]/82">
          {showHomeInMobileMenu ? (
            <Link href="/" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-[#efd1a2]">
              Home
            </Link>
          ) : null}
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-[#efd1a2]">
            Shop
          </Link>
          <div className="flex flex-col gap-2">
            <Link href="/#controllers" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-[#efd1a2]">
              Controllers
            </Link>
            <div className="ml-4 flex flex-col gap-2 border-l border-[#8f5c32]/20 pl-4 text-[0.58rem] tracking-[0.2em] text-[#d9ad75]/68">
              <Link href="/fad3rs" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-[#efd1a2]">
                FAD3RS
              </Link>
              <Link href="/mast3r" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-[#efd1a2]">
                MAST3R
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/shop/cases" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-[#efd1a2]">
              Cases
            </Link>
            <div className="ml-4 flex flex-col gap-2 border-l border-[#8f5c32]/20 pl-4 text-[0.58rem] tracking-[0.2em] text-[#d9ad75]/68">
              <Link href="/shop/cases" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-[#efd1a2]">
                In Stock Cases
              </Link>
              <Link href="/bespoke" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-[#efd1a2]">
                Bespoke
              </Link>
            </div>
          </div>
          <Link href="/#modules" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-[#efd1a2]">
            Modules
          </Link>
          <Link href="/workshop" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-[#efd1a2]">
            Workshop
          </Link>
          <Link href={joinHref} onClick={() => setMenuOpen(false)} className="transition-colors hover:text-[#efd1a2]">
            Join List
          </Link>
        </nav>
      </div>
    </header>
  );
}
