"use client";

import { useState } from "react";

interface NotifyPopupProps {
  isOpen: boolean;
  onClose: () => void;
  product: string;
}

export default function NotifyPopup({ isOpen, onClose, product }: NotifyPopupProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const isGeneralNewsletter = product === "newsletter";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(isGeneralNewsletter ? "/api/newsletter" : "/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isGeneralNewsletter ? { email } : { email, product }),
      });

      const data = await response.json();

      if (response.ok || data.success) {
        setMessage({
          type: "success",
          text: isGeneralNewsletter
            ? "You're on the Noisy by Nature list."
            : `You'll be notified when ${product.toUpperCase()} is available!`,
        });
        setEmail("");
        setTimeout(() => {
          onClose();
          setMessage(null);
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Connection error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-[#1A1410] text-[#F5EBDD] rounded-lg p-8 max-w-md w-full shadow-xl relative animate-[scaleIn_0.25s_ease-out] border border-[#8f5c32]/18">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#E6D9C5]/60 hover:text-[#d5a06a] transition-colors text-lg font-semibold"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-xl font-display text-[#d5a06a] mb-2">
          {isGeneralNewsletter ? "Join the List" : "Notify Me"}
        </h2>
        <p className="text-sm text-[#E6D9C5]/72 mb-6">
          {isGeneralNewsletter ? (
            "No spam, only handcrafted news, workshop notes, and limited-run releases."
          ) : (
            <>
              Get an email when <span className="font-semibold text-[#d5a06a]">{product.toUpperCase()}</span> is available.
            </>
          )}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-md bg-[#0f0a07] border border-[#8f5c32]/30 text-[#F5EBDD] placeholder-[#8f5c32]/50 focus:outline-none focus:border-[#d5a06a]/60 focus:ring-1 focus:ring-[#d5a06a]/20 transition"
              disabled={loading}
            />
          </div>

          {message && (
            <div
              className={`text-sm px-3 py-2 rounded-md ${
                message.type === "success"
                  ? "bg-[#d5a06a]/10 text-[#d5a06a]"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {typeof message.text === "string" ? message.text : JSON.stringify(message.text)}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-md bg-[#d5a06a] hover:bg-[#d5a06a]/90 disabled:bg-[#d5a06a]/50 text-[#1A1410] font-semibold uppercase tracking-[0.1em] transition-all duration-300"
          >
            {loading ? "Subscribing..." : isGeneralNewsletter ? "Join the Mailing List" : "Notify Me"}
          </button>
        </form>

        <p className="text-xs text-[#8f5c32]/60 text-center mt-4">
          {isGeneralNewsletter ? "No spams — only handcrafted news." : `We'll only email you about ${product.toUpperCase()} availability.`}
        </p>
      </div>
    </div>
  );
}
