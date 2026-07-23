import express from "express";

import {
  transferMoney,
} from "../controllers/transferController";

const router =
  express.Router();

router.post(
  "/:userId",
  transferMoney
);

export default router;