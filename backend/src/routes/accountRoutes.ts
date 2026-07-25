import express from "express";

import {
  getAccountBalance,
  addMoney,
  getTransactions,
  sendMoney,
} from "../controllers/accountController";

const router = express.Router();


// =========================
// GET ACCOUNT BALANCE
// =========================

router.get(
  "/:userId",
  getAccountBalance
);


// =========================
// ADD MONEY
// =========================

router.post(
  "/:userId/add-money",
  addMoney
);


// =========================
// GET TRANSACTIONS
// =========================

router.get(
  "/:userId/transactions",
  getTransactions
);


// =========================
// SEND MONEY
// =========================

router.post(
  "/:userId/send-money",
  sendMoney
);


export default router;