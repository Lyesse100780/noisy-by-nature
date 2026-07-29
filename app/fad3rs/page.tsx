import Link from "next/link";
import SiteNav from "@/components/SiteNav";

const specs = [
  "Class-compliant MIDI over USB",
  "Three 100mm Alps faders",
  "Change CC assignments on the fly and choose between five response curves — no software required",
  "Black western floral Tolex finish with a handmade studio-tool feel",
  "Compact desktop footprint: 20 × 9.6 × 2 cm",
  "Compatible with all major DAWs (Bitwig, Cubase, Ableton Live, Logic Pro, Pro Tools, Reaper, Studio One)",
  "Compatible with After Effects via MIDI2AE",
  "Extra-low profile desktop format designed for long studio sessions",
];

const curveDiagrams = [
  {
    label: "Linear",
    src: "/images/brand/fad3rs-curves/dark/1.linear_curve_smooth_dark.png",
    alt: "FAD3RS linear MIDI curve diagram",
  },
  {
    label: "Log",
    src: "/images/brand/fad3rs-curves/dark/2.log_curve_smooth_dark.png",
    alt: "FAD3RS logarithmic MIDI curve diagram",
  },
  {
    label: "Expo",
    src: "/images/brand/fad3rs-curves/dark/3.exponential_curve_smooth_dark.png",
    alt: "FAD3RS exponential MIDI curve diagram",
  },
  {
    label: "S-Curve",
    src: "/images/brand/fad3rs-curves/dark/4.s_curve_smooth_dark.png",
    alt: "FAD3RS S MIDI curve diagram",
  },
  {
    label: "65",
    src: "/images/brand/fad3rs-curves/dark/5.curve_65_smooth_dark.png",
    alt: "FAD3RS 65 MIDI curve diagram",
  },
];

const midiWarningImages = [
  {
    src: "/images/brand/fad3rs-midi-warning/fad3rs-midi-output-warning-1.png",
    alt: "Example DAW MIDI setup with FAD3RS Send To set to None",
  },
  {
    src: "/images/brand/fad3rs-midi-warning/fad3rs-midi-output-warning-2.png",
    alt: "Example DAW MIDI port setup with FAD3RS MIDI output disabled",
  },
];

const workflows = [
  "Ride orchestral expression, dynamics, and automation in real time.",
  "Shape synth parameters and effects without breaking the musical flow.",
  "Adjust volume and track vocals with ease.",
  "Replace mouse-drawn curves with tactile, repeatable movement.",
];

export default function Fad3rsPage() {
  return (
    <main className="topographic-surface min-h-screen overflow-x-hidden bg-[#1A1410] text-[#F5EBDD]">
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
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 md:mb-10">
              <p className="[font-family:var(--font-inter)] mb-5 text-[0.58rem] font-medium uppercase tracking-[0.28em] text-[#d5a06a]/78">
                MIDI controller
              </p>
              <h2 className="[font-family:var(--font-playfair)] max-w-3xl text-[1.7rem] font-medium leading-tight tracking-[0.03em] text-[#e6d3b7] md:text-[2.5rem] lg:text-[2.9rem]">
                Three long-throw faders for musical automation.
              </h2>
            </div>

            <div className="relative aspect-video overflow-hidden border border-[#8f5c32]/18 bg-[#0f0a07] shadow-[0_30px_76px_rgba(0,0,0,0.34)]">
              <iframe
                src="https://www.youtube.com/embed/yhE2LEHcDf4?rel=0&modestbranding=1"
                title="FAD3RS demonstration video"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,6,0.01),rgba(12,8,6,0.16)),linear-gradient(90deg,rgba(14,9,7,0.18),transparent_42%,rgba(14,9,7,0.16))]" />
            </div>

            <div className="mt-9 md:mt-10">
              <div className="max-w-3xl space-y-5 text-[1.02rem] font-light leading-relaxed text-[#e6d9c5]/74 md:text-lg">
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

      <section className="px-4 pb-20 sm:px-6 md:px-12 md:pb-28 lg:px-20">
        <div className="mx-auto grid max-w-7xl min-w-0 gap-14 border-t border-[#8f5c32]/18 pt-12 md:grid-cols-2 md:gap-20">
          <div className="min-w-0">
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

          <div className="min-w-0">
            <p className="[font-family:var(--font-inter)] mb-8 text-[0.62rem] font-medium uppercase tracking-[0.32em] text-[#c69054]/82">
              Workflow
            </p>
            <div className="space-y-7">
              {workflows.map((workflow) => (
                <p
                  key={workflow}
                  className="max-w-xl break-words text-[1.02rem] font-light leading-relaxed text-[#e6d9c5]/72 md:text-lg"
                >
                  {workflow}
                </p>
              ))}
            </div>
          </div>

          <div className="min-w-0 md:col-span-2">
            <div className="max-w-full overflow-hidden rounded-2xl border border-[#8f5c32]/18 bg-[radial-gradient(circle_at_top_left,rgba(213,160,106,0.08),transparent_34%),linear-gradient(180deg,rgba(18,12,8,0.72),rgba(10,7,5,0.42))] p-4 shadow-[0_28px_72px_rgba(0,0,0,0.24)] sm:p-5 md:p-6">
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div className="min-w-0">
                  <p className="[font-family:var(--font-inter)] text-[0.58rem] font-medium uppercase tracking-[0.28em] text-[#c69054]/82">
                    Response curves
                  </p>
                  <p className="mt-2 max-w-2xl break-words text-sm leading-6 text-[#e6d9c5]/58">
                    Five onboard fader responses, from precise linear control to fast throws and expressive shaped moves.
                  </p>
                </div>
                <p className="[font-family:var(--font-inter)] text-[0.54rem] uppercase tracking-[0.2em] text-[#d5a06a]/56 md:hidden">
                  Swipe
                </p>
              </div>

              <div className="flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
                {curveDiagrams.map((diagram) => (
                  <figure
                    key={diagram.src}
                    className="w-[74vw] max-w-[18rem] shrink-0 snap-start overflow-hidden rounded-xl border border-[#8f5c32]/22 bg-[#0c0806]/78 p-3 shadow-[0_18px_42px_rgba(0,0,0,0.24)] md:w-auto md:max-w-none"
                  >
                    <div className="overflow-hidden rounded-lg border border-[#8f5c32]/14 bg-[#120c08]">
                      <img src={diagram.src} alt={diagram.alt} className="block aspect-[1.45] w-full object-contain p-1" />
                    </div>
                    <figcaption className="mt-3 [font-family:var(--font-inter)] text-[0.58rem] font-medium uppercase tracking-[0.18em] text-[#d5a06a]/78">
                      {diagram.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div className="mt-6 max-w-full overflow-hidden rounded-2xl border border-[#d5a06a]/24 bg-[radial-gradient(circle_at_top_left,rgba(213,160,106,0.12),transparent_32%),linear-gradient(180deg,rgba(24,14,10,0.86),rgba(10,7,5,0.54))] p-4 shadow-[0_28px_72px_rgba(0,0,0,0.24)] sm:p-5 md:p-6">
              <div className="grid min-w-0 gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
                <div className="min-w-0">
                  <p className="[font-family:var(--font-inter)] text-[0.58rem] font-medium uppercase tracking-[0.28em] text-[#d5a06a]/86">
                    MIDI setup note
                  </p>
                  <div className="mt-4 space-y-4 break-words text-sm leading-7 text-[#e6d9c5]/68 md:text-base md:leading-8">
                    <p>
                      FAD3RS is class-compliant, meaning it is automatically detected by Windows 10/11 and macOS.
                    </p>
                    <p>
                      However, make sure your DAW does not send any MIDI data to FAD3RS. In some cases, this may cause instability or even freeze your DAW.
                    </p>
                    <p>
                      To prevent this, open your DAW’s MIDI settings and disable MIDI output to FAD3RS.
                    </p>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="[font-family:var(--font-inter)] mb-3 text-[0.54rem] font-medium uppercase tracking-[0.22em] text-[#d5a06a]/58">
                    Example settings
                  </p>
                  <div className="flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:grid md:grid-cols-2 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
                    {midiWarningImages.map((image) => (
                      <figure
                        key={image.src}
                        className="w-[78vw] max-w-[22rem] shrink-0 snap-start overflow-hidden rounded-xl border border-[#8f5c32]/22 bg-[#0c0806]/76 p-2 shadow-[0_18px_42px_rgba(0,0,0,0.24)] md:w-auto md:max-w-none"
                      >
                        <img src={image.src} alt={image.alt} className="block w-full rounded-lg object-contain" />
                      </figure>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
