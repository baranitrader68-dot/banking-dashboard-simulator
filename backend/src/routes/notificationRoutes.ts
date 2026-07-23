const express = require("express");

import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController";

const router = express.Router();

router.get("/:userId", getNotifications);

router.patch(
  "/:notificationId/read",
  markNotificationAsRead
);

export default router;