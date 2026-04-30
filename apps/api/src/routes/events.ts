import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import type { Env, Variables, ResponseApi } from "../types";
import { getDb } from "../db";
import { eventsTable, quotasTable, promoCodesTable } from "../db/schema";
import { AppError, handleAnyError } from "../errors/app_error";
import { convertTimestamps, convertTimestampsArray } from "../utils/date";

export const eventsApp = new Hono<{ Bindings: Env; Variables: Variables }>();

type EventResponse = {
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
  createdAt: string | null;
  updatedAt: string | null;
};

eventsApp.get("/", async (c) => {
  try {
    const db = getDb(c.env);
    const rows = await db
      .select({
        event: eventsTable,
        quota: quotasTable,
      })
      .from(eventsTable)
      .leftJoin(quotasTable, eq(quotasTable.event_id, eventsTable.id))
      .where(eq(eventsTable.is_active, 1));

    const eventIds = rows.map((r) => r.event.id);
    const promos =
      eventIds.length === 0
        ? []
        : await db
            .select()
            .from(promoCodesTable)
            .where(eq(promoCodesTable.is_active, 1));

    const promoByEvent = new Map<number, string>();
    for (const p of promos) {
      if (p.event_id != null && !promoByEvent.has(p.event_id)) {
        promoByEvent.set(p.event_id, p.code);
      }
    }

    const data: EventResponse[] = rows.map(({ event, quota }) => ({
      ...event,
      total_slots: quota?.total_slots ?? 0,
      remaining_slots: quota?.remaining_slots ?? 0,
      promo_code: promoByEvent.get(event.id) ?? null,
    }));

    const body: ResponseApi<EventResponse[]> = {
      success: true,
      message: "OK",
      data: convertTimestampsArray(data),
    };
    return c.json(body);
  } catch (e) {
    return handleAnyError(c, e);
  }
});

eventsApp.get("/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const db = getDb(c.env);
    const [row] = await db
      .select({ event: eventsTable, quota: quotasTable })
      .from(eventsTable)
      .leftJoin(quotasTable, eq(quotasTable.event_id, eventsTable.id))
      .where(and(eq(eventsTable.slug, slug), eq(eventsTable.is_active, 1)))
      .limit(1);

    if (!row) throw new AppError("Event tidak ditemukan", 404);

    const [promo] = await db
      .select()
      .from(promoCodesTable)
      .where(
        and(
          eq(promoCodesTable.event_id, row.event.id),
          eq(promoCodesTable.is_active, 1),
        ),
      )
      .limit(1);

    const data: EventResponse = {
      ...row.event,
      total_slots: row.quota?.total_slots ?? 0,
      remaining_slots: row.quota?.remaining_slots ?? 0,
      promo_code: promo?.code ?? null,
    };

    const body: ResponseApi<EventResponse> = {
      success: true,
      message: "OK",
      data: convertTimestamps(data),
    };
    return c.json(body);
  } catch (e) {
    return handleAnyError(c, e);
  }
});
