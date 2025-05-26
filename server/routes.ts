import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Temporary email routes
  app.post("/api/temp-email/generate", async (req, res) => {
    try {
      const tempEmail = await storage.generateTempEmail();
      res.json(tempEmail);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate temporary email" });
    }
  });

  app.get("/api/temp-email/:email/messages", async (req, res) => {
    try {
      const { email } = req.params;
      const messages = await storage.getTempEmailMessages(email);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.delete("/api/temp-email/:email", async (req, res) => {
    try {
      const { email } = req.params;
      await storage.deleteTempEmail(email);
      res.json({ message: "Temporary email deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete temporary email" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
