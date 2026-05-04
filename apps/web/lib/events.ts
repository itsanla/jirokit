import { apiFetch, ApiError } from "./api";

export interface Event {
  id: number;
  slug: string;
  title: string;
  emoji: string;
  target: string;
  description: string;
  benefits: string[];
  totalSlots: number;
  remainingSlots: number;
  promoCode: string | null;
  normalPrice: number;
  eventPrice: number;
  isActive: boolean;
}

interface RawEvent {
  id: number;
  slug: string;
  title: string;
  emoji: string;
  target: string;
  description: string;
  benefits: string[];
  normal_price: number;
  event_price: number;
  is_active: number;
  total_slots: number;
  remaining_slots: number;
  promo_code: string | null;
}

function mapEvent(raw: RawEvent): Event {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    emoji: raw.emoji,
    target: raw.target,
    description: raw.description,
    benefits: raw.benefits,
    totalSlots: raw.total_slots,
    remainingSlots: raw.remaining_slots,
    promoCode: raw.promo_code,
    normalPrice: raw.normal_price,
    eventPrice: raw.event_price,
    isActive: raw.is_active === 1,
  };
}

export async function getAllEvents(): Promise<Event[]> {
  try {
    const raw = await apiFetch<RawEvent[]>("/api/events");
    return raw.map(mapEvent);
  } catch (e) {
    if (e instanceof TypeError && e.message.includes("fetch")) return [];
    throw e;
  }
}

export async function getAllEventSlugs(): Promise<string[]> {
  const events = await getAllEvents();
  return events.map((e) => e.slug);
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const raw = await apiFetch<RawEvent>(`/api/events/${slug}`);
    return mapEvent(raw);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    // Connection error at build time — treat as not found
    if (e instanceof TypeError && e.message.includes("fetch")) return null;
    throw e;
  }
}

export async function getRelatedEvents(
  currentSlug: string,
  limit = 3,
): Promise<Event[]> {
  const all = await getAllEvents();
  return all.filter((e) => e.slug !== currentSlug).slice(0, limit);
}

export function formatIDR(value: number): string {
  if (value === 0) return "Rp 0";
  return `Rp ${value.toLocaleString("id-ID")}`;
}
