import express = require("express");

import {
  getAccountBalance,
  addMoney,
} from "../controllers/accountController";

const router = express.Router();

router.get("/:userId", getAccountBalance);

router.post("/:userId/add-money", addMoney);

export default router;