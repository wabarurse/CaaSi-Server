import { Router } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema/index.js";
import { eq } from "drizzle-orm";
import { logger } from "../utils/logger.js";

const router = Router();

// Create user
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Missing required field: email" });
    }

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        isKycCompleted: false,
      })
      .returning({ id: users.id });

    logger.info("User created", { id: newUser.id, email });
    return res.status(201).json({ id: newUser.id });
  } catch (error) {
    logger.error("Error creating user", error);
    return res.status(500).json({ error: "Failed to create user" });
  }
});

// Get user by id
router.get("/", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing required field: userId" });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    logger.info("User fetched", { userId });
    return res.json(user);
  } catch (error) {
    logger.error("Error fetching user", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Submit KYC information
router.post("/kyc", async (req, res) => {
  try {
    const { userId, firstName, lastName, dateOfBirth } = req.body;

    if (!userId || !firstName || !lastName || !dateOfBirth) {
      return res.status(400).json({ error: "Missing required fields: userId, firstName, lastName, dateOfBirth" });
    }

    const [existingUser] = await db.select().from(users).where(eq(users.id, userId));

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await db
      .update(users)
      .set({
        firstName,
        lastName,
        dateOfBirth,
        isKycCompleted: true,
      })
      .where(eq(users.id, userId));

    logger.info("KYC submitted", { userId });
    return res.json({ approved: true });
  } catch (error) {
    logger.error("Error submitting KYC", error);
    return res.status(500).json({ error: "Failed to submit KYC information" });
  }
});

export default router;
