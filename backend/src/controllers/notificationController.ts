import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get Notifications
export const getNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);

    const notifications =
      await prisma.notification.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Mark Notification as Read
export const markNotificationAsRead = async (
  req: Request,
  res: Response
) => {
  try {
    const notificationId = Number(
      req.params.notificationId
    );

    const notification =
      await prisma.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          isRead: true,
        },
      });

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};