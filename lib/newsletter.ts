type MailerLiteWindow = Window & {
  ml?: (action: "show", formId: string, force: boolean) => void;
  notifyPopupOpen?: (product: string) => void;
  __mailerliteLoaded?: boolean;
  __mailerliteLoadFailed?: boolean;
};

const defaultFormId = "eWb4s9";
type NewsletterPopupOptions = {
  fallbackToHome?: boolean;
};

export function openNewsletterPopup(): void;
export function openNewsletterPopup(notifyProductKey: string): void;
export function openNewsletterPopup(
  notifyProductKey: string | undefined,
  options: NewsletterPopupOptions,
): void;
export function openNewsletterPopup(arg?: unknown, options: NewsletterPopupOptions = {}) {
  if (typeof window === "undefined") return;

  const { fallbackToHome = true } = options;
  const product = typeof arg === "string" && arg.length > 0 ? arg : undefined;

  // If product is specified, use the custom notify popup
  if (product) {
    const mailerLite = window as MailerLiteWindow;
    if (typeof mailerLite.notifyPopupOpen === "function") {
      mailerLite.notifyPopupOpen(product);
      return;
    }
    console.warn("Notify popup not available");
    return;
  }

  // Otherwise use default MailerLite form
  let attempts = 0;
  const maxAttempts = 24;
  const retryDelay = 180;

  const fallback = () => {
    if (!fallbackToHome) return;

    if (window.location.pathname === "/") {
      window.location.hash = "join-list";
      return;
    }

    window.location.href = "/?newsletter=1#join-list";
  };

  const tryOpen = () => {
    const mailerLite = window as MailerLiteWindow;

    if (mailerLite.__mailerliteLoaded && typeof mailerLite.ml === "function") {
      mailerLite.ml("show", defaultFormId, true);
      return;
    }

    attempts += 1;

    if (!mailerLite.__mailerliteLoadFailed && attempts < maxAttempts) {
      window.setTimeout(tryOpen, retryDelay);
      return;
    }

    fallback();
  };

  tryOpen();
}
