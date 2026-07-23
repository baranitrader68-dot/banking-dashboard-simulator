import express from "express";

import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController";

const router = express.Router();

// Get User Profile
router.get("/:userId", getUserProfile);

// Update User Profile
router.put("/:userId", updateUserProfile);

export default router;