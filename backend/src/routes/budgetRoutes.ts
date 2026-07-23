import express = require("express");

import {
  createBudget,
  getBudgets,
} from "../controllers/budgetController";

const router = express.Router();

router.post("/:userId", createBudget);

router.get("/:userId", getBudgets);

export default router;