import { users, tempEmails, tempEmailMessages, type User, type InsertUser, type TempEmail, type InsertTempEmail, type TempEmailMessage, type InsertTempEmailMessage } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tempEmails: Map<string, TempEmail>;
  private tempEmailMessages: Map<number, TempEmailMessage>;
  private currentUserId: number;
  private currentTempEmailId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.tempEmails = new Map();
    this.tempEmailMessages = new Map();
    this.currentUserId = 1;
    this.currentTempEmailId = 1;
    this.currentMessageId = 1;

    // Start cleanup interval for expired emails
    setInterval(() => {
      this.cleanupExpiredTempEmails();
    }, 60000); // Check every minute
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async generateTempEmail(): Promise<TempEmail> {
    const id = this.currentTempEmailId++;
    const randomString = Math.random().toString(36).substring(2, 10);
    const email = `temp_${randomString}@tempmail.dev`;
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const tempEmail: TempEmail = {
      id,
      email,
      createdAt,
      expiresAt,
    };

    this.tempEmails.set(email, tempEmail);
    return tempEmail;
  }

  async getTempEmail(email: string): Promise<TempEmail | undefined> {
    return this.tempEmails.get(email);
  }

  async getTempEmailMessages(email: string): Promise<TempEmailMessage[]> {
    const tempEmail = await this.getTempEmail(email);
    if (!tempEmail) {
      return [];
    }

    return Array.from(this.tempEmailMessages.values()).filter(
      (message) => message.tempEmailId === tempEmail.id
    );
  }

  async addTempEmailMessage(insertMessage: InsertTempEmailMessage): Promise<TempEmailMessage> {
    const id = this.currentMessageId++;
    const message: TempEmailMessage = {
      ...insertMessage,
      id,
      receivedAt: new Date(),
    };

    this.tempEmailMessages.set(id, message);
    return message;
  }

  async deleteTempEmail(email: string): Promise<void> {
    const tempEmail = this.tempEmails.get(email);
    if (tempEmail) {
      this.tempEmails.delete(email);
      
      // Delete associated messages
      const messages = Array.from(this.tempEmailMessages.entries());
      messages.forEach(([messageId, message]) => {
        if (message.tempEmailId === tempEmail.id) {
          this.tempEmailMessages.delete(messageId);
        }
      });
    }
  }

  async cleanupExpiredTempEmails(): Promise<void> {
    const now = new Date();
    const expiredEmails: string[] = [];

    this.tempEmails.forEach((tempEmail, email) => {
      if (tempEmail.expiresAt < now) {
        expiredEmails.push(email);
      }
    });

    for (const email of expiredEmails) {
      await this.deleteTempEmail(email);
    }
  }
}

export const storage = new MemStorage();
