"use client";

/**
 * @param {{ id?: string, copy?: string }} props
 */
export default function Newsletter(props) {
  const {
    id,
    copy = "Subscribe to make sure you don't miss anything.",
  } = props;
  return (
    <section id={id} className="bg-transparent px-0 py-0">
      <div className="bg-[#120c08]/28 px-6 py-5 md:px-10 md:py-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <div>
            <p className="max-w-2xl text-[1rem] font-light leading-7 text-[#e6d9c5]/74 md:text-[1.05rem]">
              {copy}
            </p>
          </div>

          <div className="flex justify-center">
            <div
              dangerouslySetInnerHTML={{
                __html: `
                  <a
                    class="ml-onclick-form"
                    href="javascript:void(0)"
                    onclick="ml('show', 'eWb4s9', true)"
                    style="
                      display:inline-flex;
                      align-items:center;
                      justify-content:center;
                      min-width:220px;
                      padding:13px 18px;
                      border:1px solid rgba(198, 144, 84, 0.42);
                      background:rgba(18, 12, 8, 0.22);
                      color:#d5a06a;
                      font-family:var(--font-inter);
                      font-weight:500;
                      font-size:11px;
                      letter-spacing:0.22em;
                      text-transform:uppercase;
                      text-align:center;
                      text-decoration:none;
                      transition:border-color 0.22s ease, color 0.22s ease, background 0.22s ease;
                    "
                    onmouseover="this.style.borderColor='rgba(213,160,106,0.7)';this.style.color='#efd1a2';this.style.background='rgba(18,12,8,0.42)'"
                    onmouseout="this.style.borderColor='rgba(198,144,84,0.42)';this.style.color='#d5a06a';this.style.background='rgba(18,12,8,0.22)'"
                  >
                    Join the mailing list
                  </a>
                `,
              }}
            />
          </div>
          <p className="-mt-2 text-xs text-[#8a7965]">
            no spams — only handcrafted news.
          </p>
        </div>
      </div>
    </section>
  );
}
