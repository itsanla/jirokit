import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const discountTypeEnum = ["free", "percentage", "fixed"] as const;
export type DiscountType = (typeof discountTypeEnum)[number];

export const eventsTable = sqliteTable("Event", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  emoji: text("emoji").notNull(),
  target: text("target").notNull(),
  description: text("description").notNull(),
  benefits: text("benefits", { mode: "json" }).$type<string[]>().notNull(),
  normal_price: integer("normal_price").notNull(),
  event_price: integer("event_price").notNull(),
  is_active: integer("is_active").notNull().default(1),
  createdAt: integer("createdAt")
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updatedAt")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const quotasTable = sqliteTable("Quota", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  event_id: integer("event_id")
    .notNull()
    .unique()
    .references(() => eventsTable.id, { onDelete: "cascade" }),
  total_slots: integer("total_slots").notNull().default(0),
  remaining_slots: integer("remaining_slots").notNull().default(0),
  updatedAt: integer("updatedAt")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const promoCodesTable = sqliteTable("PromoCode", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  event_id: integer("event_id").references(() => eventsTable.id, {
    onDelete: "cascade",
  }),
  code: text("code").notNull().unique(),
  description: text("description"),
  discount_type: text("discount_type").notNull().$type<DiscountType>(),
  discount_value: integer("discount_value").notNull().default(0),
  max_uses: integer("max_uses"),
  current_uses: integer("current_uses").notNull().default(0),
  valid_until: integer("valid_until"),
  is_active: integer("is_active").notNull().default(1),
  createdAt: integer("createdAt")
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updatedAt")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const eventsRelations = relations(eventsTable, ({ one, many }) => ({
  quota: one(quotasTable, {
    fields: [eventsTable.id],
    references: [quotasTable.event_id],
  }),
  promoCodes: many(promoCodesTable),
}));

export const quotasRelations = relations(quotasTable, ({ one }) => ({
  event: one(eventsTable, {
    fields: [quotasTable.event_id],
    references: [eventsTable.id],
  }),
}));

export const promoCodesRelations = relations(promoCodesTable, ({ one }) => ({
  event: one(eventsTable, {
    fields: [promoCodesTable.event_id],
    references: [eventsTable.id],
  }),
}));

export type Event = typeof eventsTable.$inferSelect;
export type Quota = typeof quotasTable.$inferSelect;
export type PromoCode = typeof promoCodesTable.$inferSelect;
