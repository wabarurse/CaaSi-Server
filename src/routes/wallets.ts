import { Router } from "express";
import { db } from "../db/index.js";
import { wallets, users } from "../db/schema/index.js";
import { eq } from "drizzle-orm";
import { logger } from "../utils/logger.js";

const router = Router();

// Generate random 6 character string
function generateWalletAddress(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create wallet
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing required field: userId" });
    }

    // Verify user exists
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const address = generateWalletAddress();

    const [newWallet] = await db
      .insert(wallets)
      .values({
        userId,
        address,
      })
      .returning({ id: wallets.id, address: wallets.address });

    logger.info("Wallet created", { id: newWallet.id, userId, address: newWallet.address });
    return res.status(201).json({ id: newWallet.id, address: newWallet.address });
  } catch (error) {
    logger.error("Error creating wallet", error);
    return res.status(500).json({ error: "Failed to create wallet" });
  }
});

// Get wallet by user id
router.get("/", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing required field: userId" });
    }

    const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    logger.info("Wallet fetched", { userId });
    return res.json({ walletId: wallet.id, address: wallet.address });
  } catch (error) {
    logger.error("Error fetching wallet", error);
    return res.status(500).json({ error: "Failed to fetch wallet" });
  }
});

export default router;
