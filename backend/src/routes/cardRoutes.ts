import express from "express";

import {
  createCard,
  getCard,
} from "../controllers/cardController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Create virtual card
router.post(
  "/:userId",
  protect,
  createCard
);

// Get virtual card
router.get(
  "/:userId",
  protect,
  getCard
);

export default router;