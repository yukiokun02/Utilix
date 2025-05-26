import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tempEmails = pgTable("temp_emails", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const tempEmailMessages = pgTable("temp_email_messages", {
  id: serial("id").primaryKey(),
  tempEmailId: integer("temp_email_id").references(() => tempEmails.id).notNull(),
  fromEmail: text("from_email").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  receivedAt: timestamp("received_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTempEmailSchema = createInsertSchema(tempEmails).omit({
  id: true,
  createdAt: true,
});

export const insertTempEmailMessageSchema = createInsertSchema(tempEmailMessages).omit({
  id: true,
  receivedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TempEmail = typeof tempEmails.$inferSelect;
export type InsertTempEmail = z.infer<typeof insertTempEmailSchema>;
export type TempEmailMessage = typeof tempEmailMessages.$inferSelect;
export type InsertTempEmailMessage = z.infer<typeof insertTempEmailMessageSchema>;
