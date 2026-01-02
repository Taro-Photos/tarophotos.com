export type AnalyticsEvent =
  | { name: "cta_click"; params: { location: string; label: string } }
  | { name: "view_series"; params: { series_slug: string } }
  | { name: "filter_change"; params: { facet: string; value: string } }
  | { name: "paginate"; params: { page: number } }
  | { name: "lightbox_open"; params: { series_slug: string; index: number } }
  | { name: "contact_open"; params: { source: string } }
  | { name: "contact_submit"; params: { service?: string | null; budget?: string | null } }
  | { name: "delivery_open"; params: { client: string; gallery: string } }
  | { name: "scroll_75"; params: { path: string } }
  | { name: "view_post"; params: { slug: string } };

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function pushAnalyticsEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  window.dataLayer.push({ event: event.name, ...event.params });
}
