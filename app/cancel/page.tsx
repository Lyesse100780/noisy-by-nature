export default function CancelPage() {
  return (
    <div className="min-h-screen bg-[#1A1410] text-[#F5EBDD] flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-3xl font-display text-noisy-copper">
          Payment cancelled
        </h1>
        <p className="text-sm text-[#E6D9C5]/80 font-body">
          No payment was processed. If you encountered a problem or changed
          your mind, you can safely close this page or go back to the shop.
        </p>
        <a
          href="/shop"
          className="inline-block mt-4 px-6 py-3 rounded-md border border-noisy-copper/60 text-sm uppercase tracking-wide font-body hover:bg-noisy-copper hover:text-[#1A1410] transition-all"
        >
          Back to shop
        </a>
      </div>
    </div>
  );
}
