import express = require("express");

import {
  registerUser,
  loginUser,
} from "../controllers/authController";

const router = express.Router();

// Signup API
router.post("/signup", registerUser);

// Login API
router.post("/login", loginUser);

export default router;