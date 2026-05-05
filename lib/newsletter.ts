type MailerLiteWindow = Window & {
  ml?: (action: "show", formId: string, force: boolean) => void;
};

export function openNewsletterPopup() {
  if (typeof window === "undefined") return;

  let attempts = 0;

  const tryOpen = () => {
    const mailerLite = window as MailerLiteWindow;

    if (typeof mailerLite.ml === "function") {
      mailerLite.ml("show", "eWb4s9", true);
      return;
    }

    attempts += 1;

    if (attempts < 12) {
      window.setTimeout(tryOpen, 180);
      return;
    }

    window.location.href = "/?newsletter=1#join-list";
  };

  tryOpen();
}
