"use client";

export default function Newsletter() {
  return (
    <section className="pt-10 pb-0 px-6 flex justify-center bg-transparent border-t border-[#3a2c22]/40">

      <div className="max-w-md w-full text-center">

        {/* Bouton MailerLite natif */}
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <a
                class="ml-onclick-form"
                href="javascript:void(0)"
                onclick="ml('show', 'eWb4s9', true)"
                style="
                  display:block;
                  width:100%;
                  padding:12px 16px;
                  border-radius:8px;
                  background:#c9a65c;
                  color:#1a1410;
                  font-weight:600;
                  font-size:16px;
                  text-align:center;
                  text-decoration:none;
                  transition:background 0.25s ease;
                "
                onmouseover="this.style.background='#d0af7a'"
                onmouseout="this.style.background='#c9a65c'"
              >
                Join the mailing list
              </a>
            `,
          }}
        />

        <p className="mt-4 text-xs text-[#8a7965] italic">
          No spam — only handcrafted news.
        </p>
      </div>
    </section>
  );
}
