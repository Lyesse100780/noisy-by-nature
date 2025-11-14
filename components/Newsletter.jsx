"use client";
import { useEffect, useRef } from "react";

export default function Newsletter() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Charger MailerLite une seule fois
    if (!document.getElementById("ml-universal")) {
      const script = document.createElement("script");
      script.src = "https://assets.mailerlite.com/js/universal.js";
      script.id = "ml-universal";
      script.async = true;
      script.onload = () => {
        if (window.ml) window.ml("account", "1914173");
        injectForm();
      };
      document.body.appendChild(script);
    } else {
      if (window.ml) window.ml("account", "1914173");
      injectForm();
    }

    // Injection manuelle du mini formulaire
    function injectForm() {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = `
        <form
          class="ml-manual"
          action="https://assets.mailerlite.com/jsonp/1914173/forms/submit"
          method="post"
          target="_blank"
          style="margin:0 auto;max-width:360px;"
        >
          <input
            type="email"
            name="fields[email]"
            placeholder="Your email address"
            required
            style="
              width:100%;
              padding:10px 14px;
              border:1px solid #b89c7a;
              border-radius:6px;
              background:#2a211b;
              color:#f5ebdd;
              font-size:15px;
              box-sizing:border-box;
              text-align:center;
              outline:none;
              transition:border 0.2s ease;
            "
            onfocus="this.style.border='1px solid #c9a65c'"
            onblur="this.style.border='1px solid #b89c7a'"
          />
          <button
            type="submit"
            style="
              display:block;
              width:100%;
              margin-top:8px;
              background:#c9a65c;
              color:#1a1410;
              border:none;
              border-radius:6px;
              padding:10px 14px;
              font-weight:600;
              cursor:pointer;
              transition:background 0.25s ease;
            "
            onmouseover="this.style.background='#d0af7a'"
            onmouseout="this.style.background='#c9a65c'"
          >
            Subscribe
          </button>
        </form>`;
    }
  }, []);

  return (
    <section className="text-[#F5EAD6] py-6 px-6 flex justify-center bg-transparent border-t border-[#3a2c22]/40 mb-[-1.5rem]">
      <div className="max-w-md w-full text-center">
        <h2 className="text-lg font-semibold mb-2 text-[#C9A65C] tracking-wide">
          Stay tuned for upcoming drops
        </h2>
        <p className="text-sm text-[#D4C1A6] mb-4">
          Join the mailing list and be the first to know when new handcrafted
          cases go live.
        </p>

        <div ref={containerRef}></div>

        <p className="mt-3 text-xs text-[#8a7965] italic">
          No spam — only handcrafted news.
        </p>
      </div>
    </section>
  );
}
