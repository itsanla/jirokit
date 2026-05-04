import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import type { Env, Variables, ResponseApi } from "../types";
import { getDb } from "../db";
import {
  eventsTable,
  promoCodesTable,
  quotasTable,
  registrationsTable,
} from "../db/schema";
import { AppError, handleAnyError } from "../errors/app_error";
import { Validator } from "../utils/validation";

export const registrationsApp = new Hono<{
  Bindings: Env;
  Variables: Variables;
}>();

type CreateRegistrationBody = {
  event_slug?: string;
  promo_code?: string;
  customer_name?: string;
  customer_whatsapp?: string;
  customer_email?: string;
  customer_city?: string;
  business_name?: string;
  business_type?: string;
  business_description?: string;
  business_address?: string;
  business_hours?: string;
  business_instagram?: string;
  notes?: string;
};

type CreateRegistrationResponse = {
  id: number;
  final_price: number;
};

registrationsApp.post("/", async (c) => {
  try {
    const body = (await c.req
      .json()
      .catch(() => ({}))) as CreateRegistrationBody;

    const v = new Validator()
      .required(body.event_slug?.trim(), "event_slug", "Event wajib dipilih.")
      .required(
        body.customer_name?.trim(),
        "customer_name",
        "Nama lengkap wajib diisi.",
      )
      .required(
        body.customer_whatsapp?.trim(),
        "customer_whatsapp",
        "Nomor WhatsApp wajib diisi.",
      );

    if (v.hasErrors()) {
      throw new AppError("Validasi gagal", 422, v.getErrors());
    }

    const db = getDb(c.env);

    const [event] = await db
      .select()
      .from(eventsTable)
      .where(
        and(
          eq(eventsTable.slug, body.event_slug!.trim()),
          eq(eventsTable.is_active, 1),
        ),
      )
      .limit(1);

    if (!event) throw new AppError("Event tidak ditemukan atau tidak aktif.", 404);

    let finalPrice = event.event_price;
    let promoCodeUsed: string | null = null;

    if (body.promo_code?.trim()) {
      const code = body.promo_code.trim().toUpperCase();

      const [promo] = await db
        .select()
        .from(promoCodesTable)
        .where(
          and(
            eq(promoCodesTable.code, code),
            eq(promoCodesTable.is_active, 1),
          ),
        )
        .limit(1);

      if (!promo) throw new AppError("Kode promo tidak valid.", 400);

      if (promo.event_id != null && promo.event_id !== event.id) {
        throw new AppError("Kode promo tidak berlaku untuk event ini.", 400);
      }

      if (
        promo.valid_until != null &&
        Math.floor(Date.now() / 1000) > promo.valid_until
      ) {
        throw new AppError("Kode promo sudah kadaluarsa.", 400);
      }

      if (promo.max_uses != null && promo.current_uses >= promo.max_uses) {
        throw new AppError("Kuota kode promo sudah habis.", 400);
      }

      if (promo.discount_type === "free") {
        finalPrice = 0;
      } else if (promo.discount_type === "percentage") {
        finalPrice = Math.max(
          0,
          Math.round(event.event_price * (1 - promo.discount_value / 100)),
        );
      } else {
        finalPrice = Math.max(0, event.event_price - promo.discount_value);
      }

      promoCodeUsed = code;

      await db
        .update(promoCodesTable)
        .set({
          current_uses: promo.current_uses + 1,
          updatedAt: Math.floor(Date.now() / 1000),
        })
        .where(eq(promoCodesTable.id, promo.id));
    }

    const [reg] = await db
      .insert(registrationsTable)
      .values({
        event_id: event.id,
        promo_code: promoCodeUsed,
        initial_price: event.event_price,
        final_price: finalPrice,
        status: finalPrice === 0 ? "form_completed" : "pending_form",
        customer_name: body.customer_name!.trim(),
        customer_whatsapp: body.customer_whatsapp!.trim(),
        customer_email: body.customer_email?.trim() || null,
        customer_city: body.customer_city?.trim() || null,
        business_name: body.business_name?.trim() || null,
        business_type: body.business_type?.trim() || null,
        business_description: body.business_description?.trim() || null,
        business_address: body.business_address?.trim() || null,
        business_hours: body.business_hours?.trim() || null,
        business_instagram: body.business_instagram?.trim() || null,
        notes: body.notes?.trim() || null,
        createdAt: Math.floor(Date.now() / 1000),
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .returning({ id: registrationsTable.id });

    if (finalPrice === 0 && promoCodeUsed) {
      const [quota] = await db
        .select()
        .from(quotasTable)
        .where(eq(quotasTable.event_id, event.id))
        .limit(1);

      if (quota && quota.remaining_slots > 0) {
        await db
          .update(quotasTable)
          .set({
            remaining_slots: quota.remaining_slots - 1,
            updatedAt: Math.floor(Date.now() / 1000),
          })
          .where(eq(quotasTable.id, quota.id));
      }
    }

    const res: ResponseApi<CreateRegistrationResponse> = {
      success: true,
      message: "Pendaftaran berhasil! Tim kami akan segera menghubungi Anda.",
      data: { id: reg.id, final_price: finalPrice },
    };

    return c.json(res, 201);
  } catch (e) {
    return handleAnyError(c, e);
  }
});
