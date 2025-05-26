import { users, tempEmails, tempEmailMessages, type User, type InsertUser, type TempEmail, type InsertTempEmail, type TempEmailMessage, type InsertTempEmailMessage } from "@shared/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, lt } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  generateTempEmail(): Promise<TempEmail>;
  getTempEmail(email: string): Promise<TempEmail | undefined>;
  getTempEmailMessages(email: string): Promise<TempEmailMessage[]>;
  addTempEmailMessage(message: InsertTempEmailMessage): Promise<TempEmailMessage>;
  deleteTempEmail(email: string): Promise<void>;
  cleanupExpiredTempEmails(): Promise<void>;
}

// Database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export class DatabaseStorage implements IStorage {
  constructor() {
    // Start cleanup interval for expired emails
    setInterval(() => {
      this.cleanupExpiredTempEmails();
    }, 60000); // Check every minute
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async generateTempEmail(): Promise<TempEmail> {
    const randomString = Math.random().toString(36).substring(2, 10);
    const email = `temp_${randomString}@tempmail.dev`;
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const result = await db.insert(tempEmails).values({
      email,
      expiresAt,
    }).returning();
    
    return result[0];
  }

  async getTempEmail(email: string): Promise<TempEmail | undefined> {
    const result = await db.select().from(tempEmails).where(eq(tempEmails.email, email)).limit(1);
    return result[0];
  }

  async getTempEmailMessages(email: string): Promise<TempEmailMessage[]> {
    const tempEmail = await this.getTempEmail(email);
    if (!tempEmail) {
      return [];
    }

    const result = await db.select().from(tempEmailMessages).where(eq(tempEmailMessages.tempEmailId, tempEmail.id));
    return result;
  }

  async addTempEmailMessage(insertMessage: InsertTempEmailMessage): Promise<TempEmailMessage> {
    const result = await db.insert(tempEmailMessages).values(insertMessage).returning();
    return result[0];
  }

  async deleteTempEmail(email: string): Promise<void> {
    const tempEmail = await this.getTempEmail(email);
    if (tempEmail) {
      // Delete associated messages first
      await db.delete(tempEmailMessages).where(eq(tempEmailMessages.tempEmailId, tempEmail.id));
      // Delete the temp email
      await db.delete(tempEmails).where(eq(tempEmails.email, email));
    }
  }

  async cleanupExpiredTempEmails(): Promise<void> {
    const now = new Date();
    
    // Get expired emails
    const expiredEmails = await db.select().from(tempEmails).where(
      lt(tempEmails.expiresAt, now)
    );

    // Delete messages for expired emails
    for (const tempEmail of expiredEmails) {
      await db.delete(tempEmailMessages).where(eq(tempEmailMessages.tempEmailId, tempEmail.id));
    }

    // Delete expired emails
    await db.delete(tempEmails).where(
      lt(tempEmails.expiresAt, now)
    );
  }
}

export const storage = new DatabaseStorage();
