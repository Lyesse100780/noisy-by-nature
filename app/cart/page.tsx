import SiteNav from "@/components/SiteNav";

export default function CartPage() {
  return (
    <main className="topographic-surface min-h-screen bg-[#1A1410] text-[#F5EBDD]">
      <section className="site-hero relative overflow-hidden bg-[#100b08] text-[#f4ead8] [--hero-desktop-height:23vh] [--hero-mobile-height:8.75rem]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: "url('/images/brand/background-topography-v2.png')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(177,105,48,0.09),transparent_32%),linear-gradient(90deg,rgba(8,5,4,0.92),rgba(17,11,8,0.56)_48%,rgba(7,5,4,0.92)),linear-gradient(180deg,rgba(5,4,3,0.62),rgba(15,10,7,0.32)_54%,#1A1410_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[#1A1410]" />

        <SiteNav />

        <div className="site-hero__content relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center px-6 md:px-10 lg:px-14">
          <div className="text-center">
            <h1
              className="[font-family:var(--font-playfair)] text-[clamp(2.35rem,5.2vw,4.85rem)] font-medium uppercase leading-none tracking-[0.18em]"
              style={{
                color: "rgba(219, 198, 168, 0.92)",
                WebkitTextStroke: "0.18px rgba(255, 236, 202, 0.08)",
                textShadow:
                  "0 1px 0 rgba(255, 238, 207, 0.08), 0 -1px 0 rgba(0, 0, 0, 0.72), 0 10px 26px rgba(0, 0, 0, 0.45)",
              }}
            >
              Cart
            </h1>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl border-t border-[#8f5c32]/18 pt-10">
          <p className="[font-family:var(--font-inter)] text-[0.58rem] font-medium uppercase tracking-[0.28em] text-[#d5a06a]/74">
            Cart
          </p>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#e6d9c5]/68">
            The cart is currently empty.
          </p>
        </div>
      </section>
    </main>
  );
}
