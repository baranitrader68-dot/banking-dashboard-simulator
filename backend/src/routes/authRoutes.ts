import express from "express";

import {
  registerUser,
  loginUser,
} from "../controllers/authController";

const router = express.Router();

// =========================
// SIGNUP / REGISTER
// =========================

router.post(
  "/register",
  registerUser
);

// =========================
// LOGIN
// =========================

router.post(
  "/login",
  loginUser
);

export default router;