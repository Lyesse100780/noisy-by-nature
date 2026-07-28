export type Fad3rsUsbVariantId = "usb-a" | "usb-c";

export type Fad3rsUsbVariant = {
  id: Fad3rsUsbVariantId;
  label: string;
  detail: string;
  variantLabel: string;
  limit: number;
  soldQuantity: number;
  stockQuantity: number;
  available: boolean;
};

function readSoldQuantity(value: string | undefined) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.floor(parsed));
}

function createVariant(
  id: Fad3rsUsbVariantId,
  label: string,
  detail: string,
  variantLabel: string,
  limit: number,
  soldQuantity: number,
): Fad3rsUsbVariant {
  const stockQuantity = Math.max(0, limit - soldQuantity);

  return {
    id,
    label,
    detail,
    variantLabel,
    limit,
    soldQuantity,
    stockQuantity,
    available: stockQuantity > 0,
  };
}

export const fad3rsUsbVariants: Fad3rsUsbVariant[] = [
  createVariant(
    "usb-a",
    "USB-A",
    "Classic USB-A cable",
    "USB-A cable",
    5,
    readSoldQuantity(process.env.NEXT_PUBLIC_FAD3RS_USB_A_SOLD),
  ),
  createVariant(
    "usb-c",
    "USB-C",
    "USB-C cable for recent Macs/iPad",
    "USB-C cable",
    3,
    readSoldQuantity(process.env.NEXT_PUBLIC_FAD3RS_USB_C_SOLD),
  ),
];

export function getFad3rsUsbVariant(id?: string) {
  return fad3rsUsbVariants.find((variant) => variant.id === id);
}

export function getFad3rsRemainingStock() {
  return fad3rsUsbVariants.reduce((total, variant) => total + variant.stockQuantity, 0);
}
