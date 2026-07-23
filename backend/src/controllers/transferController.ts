import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const transferMoney = async (
  req: Request,
  res: Response
) => {
  try {
    const senderUserId = Number(req.params.userId);

    const {
      receiverUserId,
      amount,
    } = req.body;

    const receiverId = Number(
      receiverUserId
    );

    const transferAmount = Number(
      amount
    );

    // =========================
    // VALIDATION
    // =========================

    if (
      !senderUserId ||
      !receiverId ||
      !transferAmount ||
      transferAmount <= 0
    ) {
      return res.status(400).json({
        message:
          "Valid receiver and amount are required",
      });
    }

    // =========================
    // SAME USER CHECK
    // =========================

    if (
      senderUserId === receiverId
    ) {
      return res.status(400).json({
        message:
          "You cannot transfer money to yourself",
      });
    }

    // =========================
    // FIND SENDER ACCOUNT
    // =========================

    const senderAccount =
      await prisma.account.findUnique({
        where: {
          userId: senderUserId,
        },
      });

    if (!senderAccount) {
      return res.status(404).json({
        message:
          "Sender account not found",
      });
    }

    // =========================
    // FIND RECEIVER ACCOUNT
    // =========================

    const receiverAccount =
      await prisma.account.findUnique({
        where: {
          userId: receiverId,
        },
      });

    if (!receiverAccount) {
      return res.status(404).json({
        message:
          "Receiver account not found",
      });
    }

    // =========================
    // BALANCE CHECK
    // =========================

    if (
      senderAccount.balance <
      transferAmount
    ) {
      return res.status(400).json({
        message:
          "Insufficient balance",
      });
    }

    // =========================
    // DATABASE TRANSACTION
    // =========================

    await prisma.$transaction(
      async (transaction) => {

        // -------------------------
        // DECREASE SENDER BALANCE
        // -------------------------

        await transaction.account.update({
          where: {
            id: senderAccount.id,
          },

          data: {
            balance: {
              decrement:
                transferAmount,
            },
          },
        });

        // -------------------------
        // INCREASE RECEIVER BALANCE
        // -------------------------

        await transaction.account.update({
          where: {
            id: receiverAccount.id,
          },

          data: {
            balance: {
              increment:
                transferAmount,
            },
          },
        });

        // -------------------------
        // SENDER TRANSACTION
        // -------------------------

        await transaction.transaction.create({
          data: {
            type: "DEBIT",

            amount:
              transferAmount,

            description:
              `Money transferred to user ${receiverId}`,

            accountId:
              senderAccount.id,
          },
        });

        // -------------------------
        // RECEIVER TRANSACTION
        // -------------------------

        await transaction.transaction.create({
          data: {
            type: "CREDIT",

            amount:
              transferAmount,

            description:
              `Money received from user ${senderUserId}`,

            accountId:
              receiverAccount.id,
          },
        });

        // -------------------------
        // SENDER NOTIFICATION
        // -------------------------

        await transaction.notification.create({
          data: {
            title:
              "Money Sent 💸",

            message:
              `₹${transferAmount} transferred successfully to user ${receiverId}`,

            type:
              "INFO",

            userId:
              senderUserId,
          },
        });

        // -------------------------
        // RECEIVER NOTIFICATION
        // -------------------------

        await transaction.notification.create({
          data: {
            title:
              "Money Received 💰",

            message:
              `You received ₹${transferAmount} from user ${senderUserId}`,

            type:
              "INFO",

            userId:
              receiverId,
          },
        });
      }
    );

    // =========================
    // SUCCESS RESPONSE
    // =========================

    return res.status(200).json({
      message:
        "Money transferred successfully! ✅",
    });

  } catch (error) {

    console.error(
      "Transfer error:",
      error
    );

    return res.status(500).json({
      message:
        "Money transfer failed ❌",
    });
  }
};