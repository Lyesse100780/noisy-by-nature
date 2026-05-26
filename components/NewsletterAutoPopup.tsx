"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { openNewsletterPopup } from "@/lib/newsletter";

const sessionKey = "nbn-newsletter-auto-popup-seen";

export default function NewsletterAutoPopup() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname === "/" || pathname.startsWith("/studio")) return;
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(sessionKey) === "1") return;

    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(sessionKey, "1");
      openNewsletterPopup(undefined, { fallbackToHome: false });
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
