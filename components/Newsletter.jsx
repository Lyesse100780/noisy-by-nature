"use client";

import { openNewsletterPopup } from "@/lib/newsletter";

/**
 * @param {{ id?: string }} props
 */
export default function Newsletter(props) {
  const { id } = props;
  return (
    <section id={id} className="bg-transparent px-0 py-0">
      <div className="bg-[#120c08]/22 px-6 py-2 md:px-10 md:py-3">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 text-center">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={openNewsletterPopup}
              className="inline-flex min-w-[220px] items-center justify-center border border-[#c69054]/42 bg-[#120c08]/22 px-4 py-[11px] text-center [font-family:var(--font-inter)] text-[11px] font-medium uppercase tracking-[0.22em] text-[#d5a06a] transition hover:border-[#d5a06a]/70 hover:bg-[#120c08]/42 hover:text-[#efd1a2]"
            >
              Join the mailing list
            </button>
          </div>
          <p className="-mt-1 text-xs text-[#8a7965]">
            no spams — only handcrafted news.
          </p>
        </div>
      </div>
    </section>
  );
}
