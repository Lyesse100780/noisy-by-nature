import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

/**
 * GTM-first: configure GA4 (e.g. YouTube Ads conversions) inside the GTM container to avoid duplicate hits.
 * If GTM is unset, loads GA4 via {@link GoogleAnalytics} using NEXT_PUBLIC_GA4_MEASUREMENT_ID.
 */
const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();
const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();

export default function MeasurementBootstrap() {
  if (gtmId) {
    return <GoogleTagManager gtmId={gtmId} />;
  }

  if (ga4MeasurementId) {
    return <GoogleAnalytics gaId={ga4MeasurementId} />;
  }

  return null;
}
