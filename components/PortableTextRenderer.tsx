import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "next-sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-[1.02rem] font-light leading-8 text-[#e6d9c5]/76 md:text-lg">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="[font-family:var(--font-inter)] pt-6 text-xl font-medium uppercase tracking-[0.18em] text-[#e2c8a2]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="[font-family:var(--font-inter)] pt-4 text-sm font-medium uppercase tracking-[0.22em] text-[#d5a06a]/88">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l border-[#8f5c32]/35 pl-6 text-xl font-light leading-9 text-[#e6d9c5]/82">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="space-y-3 pl-5 text-[#e6d9c5]/74">{children}</ul>,
    number: ({ children }) => <ol className="space-y-3 pl-5 text-[#e6d9c5]/74">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="list-disc leading-7">{children}</li>,
    number: ({ children }) => <li className="list-decimal leading-7">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-[#d5a06a] underline decoration-[#8f5c32]/50 underline-offset-4 transition-colors hover:text-[#e4c89e]"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const imageUrl = value?.asset?.url;
      if (!imageUrl) return null;

      return (
        <div className="my-10 overflow-hidden border border-[#8f5c32]/18 bg-[#0f0a07]">
          <img src={imageUrl} alt="" className="h-auto w-full object-cover opacity-90" />
        </div>
      );
    },
  },
};

export default function PortableTextRenderer({ value }: { value?: PortableTextBlock[] }) {
  if (!value?.length) return null;

  return (
    <div className="space-y-7">
      <PortableText value={value} components={components} />
    </div>
  );
}
