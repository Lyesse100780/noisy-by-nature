"use client";

import { useEffect, useState } from "react";

type MidiWarningImage = {
  src: string;
  alt: string;
};

type Fad3rsMidiLightboxProps = {
  images: MidiWarningImage[];
};

export default function Fad3rsMidiLightbox({ images }: Fad3rsMidiLightboxProps) {
  const [activeImage, setActiveImage] = useState<MidiWarningImage | null>(null);

  useEffect(() => {
    if (!activeImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveImage(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeImage]);

  return (
    <>
      <div className="flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:grid md:grid-cols-2 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
        {images.map((image) => (
          <figure
            key={image.src}
            className="w-[78vw] max-w-[22rem] shrink-0 snap-start overflow-hidden rounded-xl border border-[#8f5c32]/22 bg-[#0c0806]/76 p-2 shadow-[0_18px_42px_rgba(0,0,0,0.24)] md:w-auto md:max-w-none"
          >
            <button
              type="button"
              onClick={() => setActiveImage(image)}
              className="group block w-full rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-[#d5a06a]/70"
              aria-label={`Open larger view: ${image.alt}`}
            >
              <img src={image.src} alt={image.alt} className="block w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-[1.01]" />
              <span className="mt-2 block [font-family:var(--font-inter)] text-[0.52rem] uppercase tracking-[0.18em] text-[#d5a06a]/54">
                Tap to enlarge
              </span>
            </button>
          </figure>
        ))}
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#080504]/88 p-4 backdrop-blur-sm md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded MIDI setup image"
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-h-[92vh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute -right-2 -top-12 flex h-10 w-10 items-center justify-center rounded-full border border-[#d5a06a]/42 bg-[#120c08] text-xl leading-none text-[#efd1a2] shadow-[0_12px_28px_rgba(0,0,0,0.34)] transition-colors hover:border-[#d5a06a]/72 hover:bg-[#1b100b] md:-right-3 md:-top-3"
              aria-label="Close expanded image"
            >
              ×
            </button>
            <div className="max-h-[92vh] overflow-auto rounded-2xl border border-[#d5a06a]/26 bg-[#0c0806] p-2 shadow-[0_32px_90px_rgba(0,0,0,0.52)] md:p-3">
              <img src={activeImage.src} alt={activeImage.alt} className="mx-auto block max-h-[86vh] w-auto max-w-full rounded-xl object-contain" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
