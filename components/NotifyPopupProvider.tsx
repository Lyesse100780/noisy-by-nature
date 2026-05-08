"use client";

import { useEffect, useState } from "react";
import NotifyPopup from "./NotifyPopup";

export default function NotifyPopupProvider() {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState("");

  useEffect(() => {
    // Make the function available globally
    (window as any).notifyPopupOpen = (productName: string) => {
      setProduct(productName);
      setIsOpen(true);
    };

    return () => {
      delete (window as any).notifyPopupOpen;
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setProduct("");
  };

  return <NotifyPopup isOpen={isOpen} onClose={handleClose} product={product} />;
}
