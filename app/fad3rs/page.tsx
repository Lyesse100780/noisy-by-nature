import Link from "next/link";
import Newsletter from "@/components/Newsletter";
import SiteNav from "@/components/SiteNav";

const specs = [
  "Class-compliant MIDI over USB",
  "Three 100mm Alps faders",
  "Change CC assignments on the fly and choose between five response curves — no software required",
  "Compatible with all major DAWs (Bitwig, Cubase, Ableton Live, Logic Pro, Pro Tools, Reaper, Studio One)",
  "Compatible with After Effects via MIDI2AE",
  "Extra-low profile desktop format designed for long studio sessions",
];

const workflows = [
  "Ride orchestral expression, dynamics, and automation in real time.",
  "Shape synth parameters and effects without breaking the musical flow.",
  "Adjust volume and track vocals with ease.",
  "Replace mouse-drawn curves with tactile, repeatable movement.",
];

export default function Fad3rsPage() {
  return (
    <main className="topographic-surface min-h-screen bg-[#1A1410] text-[#F5EBDD]">
      <section className="site-hero relative overflow-hidden bg-[#100b08] text-[#f4ead8] [--hero-desktop-height:28vh] [--hero-mobile-height:8.75rem]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: "url('/images/brand/background-topography-v2.png')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(177,105,48,0.09),transparent_32%),linear-gradient(90deg,rgba(8,5,4,0.92),rgba(17,11,8,0.56)_48%,rgba(7,5,4,0.92)),linear-gradient(180deg,rgba(5,4,3,0.62),rgba(15,10,7,0.32)_54%,#1A1410_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[#1A1410]" />

        <SiteNav />

        <div className="site-hero__content relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center px-6 md:px-10 lg:px-14">
          <div className="text-center">
            <h1 className="text-[clamp(1.75rem,7.4vw,3.8rem)] font-semibold uppercase leading-none tracking-[0.18em] text-[#dbc6a8] lg:text-[clamp(3.4rem,8vw,7rem)]">
              <span className="[font-family:var(--font-playfair)] font-medium">FAD</span>
              <span className="[font-family:var(--font-inter)] [font-variant-numeric:tabular-nums]">3</span>
              <span className="[font-family:var(--font-playfair)] font-medium">RS</span>
            </h1>
            <p className="[font-family:var(--font-inter)] mt-3 text-[clamp(0.58rem,1.35vw,0.82rem)] font-medium uppercase tracking-[0.24em] text-[#d5a06a]/88 lg:mt-4">
              Automation with Precision
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 pt-10 md:px-12 md:pb-28 md:pt-16 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-[0.54fr_0.46fr] md:items-center md:gap-14 lg:gap-20">
            <div className="relative h-[30rem] overflow-hidden border border-[#8f5c32]/18 bg-[#0f0a07] shadow-[0_30px_76px_rgba(0,0,0,0.34)] md:h-[36rem] lg:h-[42rem]">
              <img
                src="/images/brand/fad3rs-img1.png"
                alt="FAD3RS MIDI controller with three faders"
                className="h-full w-full object-cover object-center opacity-90"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,6,0.01),rgba(12,8,6,0.16)),linear-gradient(90deg,rgba(14,9,7,0.18),transparent_42%,rgba(14,9,7,0.16))]" />
            </div>

            <div className="md:py-12">
              <p className="[font-family:var(--font-inter)] mb-5 text-[0.58rem] font-medium uppercase tracking-[0.28em] text-[#d5a06a]/78">
                MIDI controller
              </p>
              <h2 className="[font-family:var(--font-playfair)] max-w-xl text-3xl font-medium leading-tight tracking-[0.03em] text-[#e6d3b7] md:text-5xl">
                Three long-throw faders for musical automation.
              </h2>
              <div className="mt-8 max-w-xl space-y-5 text-[1.02rem] font-light leading-relaxed text-[#e6d9c5]/74 md:text-lg">
                <p>
                  FAD3RS is a class-compliant MIDI controller built around three 100mm Alps faders for expressive automation and precise control.
                </p>
                <p>
                  Designed for composers, sound designers, and tactile workflows where drawing curves with a mouse breaks the musical flow.
                </p>
              </div>
              <p className="[font-family:var(--font-inter)] mt-9 text-xs font-medium uppercase tracking-[0.24em] text-[#d5a06a]/86">
                Stop clicking. Start drawing.
              </p>
              <Link
                href="/shop/fad3rs"
                className="[font-family:var(--font-inter)] mt-6 inline-flex items-center justify-center border border-[#c69054]/42 px-6 py-3 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#d5a06a] transition-colors hover:border-[#d5a06a]/70 hover:text-[#efd1a2]"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-12 md:pb-28 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-14 border-t border-[#8f5c32]/18 pt-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="[font-family:var(--font-inter)] mb-8 text-[0.62rem] font-medium uppercase tracking-[0.32em] text-[#c69054]/82">
              Key specs
            </p>
            <ul className="space-y-5">
              {specs.map((spec) => (
                <li
                  key={spec}
                  className="border-b border-[#8f5c32]/14 pb-5 text-[1rem] font-light leading-relaxed text-[#e6d9c5]/74"
                >
                  {spec}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="[font-family:var(--font-inter)] mb-8 text-[0.62rem] font-medium uppercase tracking-[0.32em] text-[#c69054]/82">
              Workflow
            </p>
            <div className="space-y-7">
              {workflows.map((workflow) => (
                <p
                  key={workflow}
                  className="max-w-xl text-[1.02rem] font-light leading-relaxed text-[#e6d9c5]/72 md:text-lg"
                >
                  {workflow}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-20">
        <div className="mx-auto max-w-7xl border-t border-[#8f5c32]/18 pt-12">
          <div className="grid gap-10 md:grid-cols-[0.45fr_0.55fr] md:items-start md:gap-16">
            <div>
              <p className="[font-family:var(--font-inter)] mb-5 text-[0.62rem] font-medium uppercase tracking-[0.32em] text-[#c69054]/82">
                Availability
              </p>
              <h2 className="[font-family:var(--font-playfair)] text-3xl font-medium leading-tight tracking-[0.03em] text-[#e6d3b7] md:text-5xl">
                Built in small runs.
              </h2>
            </div>
            <div>
              <p className="max-w-2xl text-[1.02rem] font-light leading-relaxed text-[#e6d9c5]/74 md:text-lg">
                Join the mailing list for release notes, availability, and workshop updates. For direct questions, write to the workshop.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:contact@noisybynature.eu?subject=FAD3RS%20availability"
                  className="[font-family:var(--font-inter)] inline-flex items-center justify-center border border-[#c69054]/42 px-6 py-3 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#d5a06a] transition-colors hover:border-[#d5a06a]/70 hover:text-[#efd1a2]"
                >
                  Request availability
                </a>
                <Link
                  href="/#controllers"
                  className="[font-family:var(--font-inter)] inline-flex items-center justify-center px-6 py-3 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#d5a06a]/78 transition-colors hover:text-[#efd1a2]"
                >
                  Back to products
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <Newsletter />
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-20">
        <div className="mx-auto max-w-7xl border-t border-[#8f5c32]/18 pt-12 md:pt-16">
          <div className="relative h-[22rem] overflow-hidden border border-[#8f5c32]/18 bg-[#0f0a07] shadow-[0_30px_76px_rgba(0,0,0,0.32)] md:h-[32rem] lg:h-[38rem]">
            <img
              src="/images/brand/fad3rs-img2.png"
              alt="Multiple FAD3RS controllers on a workshop table"
              className="h-full w-full object-cover object-[50%_72%] opacity-92"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,6,0.08),rgba(12,8,6,0.18)),linear-gradient(90deg,rgba(14,9,7,0.12),transparent_44%,rgba(14,9,7,0.14))]" />
          </div>
        </div>
      </section>
    </main>
  );
}
