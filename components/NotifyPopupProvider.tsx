"use client";

import { useEffect, useState } from "react";
import NotifyPopup from "./NotifyPopup";

type NotifyPopupWindow = Window & {
  notifyPopupOpen?: (productName: string) => void;
};

export default function NotifyPopupProvider() {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState("");

  useEffect(() => {
    const notifyWindow = window as NotifyPopupWindow;

    // Make the function available globally
    notifyWindow.notifyPopupOpen = (productName: string) => {
      setProduct(productName);
      setIsOpen(true);
    };

    return () => {
      delete notifyWindow.notifyPopupOpen;
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setProduct("");
  };

  return <NotifyPopup isOpen={isOpen} onClose={handleClose} product={product} />;
}
