import { Request, Response } from "express";
import prisma from "../lib/prisma";

// =========================
// GET ACCOUNT BALANCE
// =========================

export const getAccountBalance = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);

    const account = await prisma.account.findUnique({
      where: {
        userId,
      },
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    return res.status(200).json({
      balance: account.balance,
      currency: account.currency,
    });
  } catch (error) {
    console.error("Get account balance error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};


// =========================
// ADD MONEY
// =========================

export const addMoney = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);

    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const account = await prisma.account.findUnique({
      where: {
        userId,
      },
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const updatedAccount =
      await prisma.account.update({
        where: {
          userId,
        },

        data: {
          balance: {
            increment: amount,
          },

          transactions: {
            create: {
              type: "CREDIT",
              amount,
              description: "Money added",
            },
          },
        },
      });

    // =========================
    // CREATE NOTIFICATION
    // =========================

    await prisma.notification.create({
      data: {
        userId,

        title: "Money Added 💰",

        message:
          `₹${amount.toLocaleString("en-IN")} added successfully to your account.`,

        type: "CREDIT",
      },
    });

    return res.status(200).json({
      message: "Money added successfully",

      balance: updatedAccount.balance,
    });
  } catch (error) {
    console.error("Add money error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};


// =========================
// GET TRANSACTIONS
// =========================

export const getTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);

    const account = await prisma.account.findUnique({
      where: {
        userId,
      },
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const transactions =
      await prisma.transaction.findMany({
        where: {
          accountId: account.id,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Get transactions error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};


// =========================
// SEND MONEY
// =========================

export const sendMoney = async (
  req: Request,
  res: Response
) => {
  try {
    const senderId = Number(req.params.userId);

    const {
      recipientEmail,
      amount,
    } = req.body;

    const money = Number(amount);

    if (
      !recipientEmail ||
      !money ||
      money <= 0
    ) {
      return res.status(400).json({
        message:
          "Recipient email and valid amount are required",
      });
    }

    const sender =
      await prisma.user.findUnique({
        where: {
          id: senderId,
        },

        include: {
          account: true,
        },
      });

    const recipient =
      await prisma.user.findUnique({
        where: {
          email: recipientEmail,
        },

        include: {
          account: true,
        },
      });

    if (
      !sender ||
      !sender.account
    ) {
      return res.status(404).json({
        message: "Sender account not found",
      });
    }

    if (
      !recipient ||
      !recipient.account
    ) {
      return res.status(404).json({
        message: "Recipient not found",
      });
    }

    if (
      sender.account.balance < money
    ) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // =========================
    // TRANSFER MONEY
    // =========================

    await prisma.$transaction([
      // Sender account
      prisma.account.update({
        where: {
          id: sender.account.id,
        },

        data: {
          balance: {
            decrement: money,
          },

          transactions: {
            create: {
              type: "DEBIT",
              amount: money,

              description:
                `Money sent to ${recipient.email}`,
            },
          },
        },
      }),

      // Recipient account
      prisma.account.update({
        where: {
          id: recipient.account.id,
        },

        data: {
          balance: {
            increment: money,
          },

          transactions: {
            create: {
              type: "CREDIT",
              amount: money,

              description:
                `Money received from ${sender.email}`,
            },
          },
        },
      }),

      // Sender notification
      prisma.notification.create({
        data: {
          userId: sender.id,

          title: "Money Sent 💸",

          message:
            `₹${money.toLocaleString("en-IN")} sent to ${recipient.email}.`,

          type: "DEBIT",
        },
      }),

      // Recipient notification
      prisma.notification.create({
        data: {
          userId: recipient.id,

          title: "Money Received 💰",

          message:
            `₹${money.toLocaleString("en-IN")} received from ${sender.email}.`,

          type: "CREDIT",
        },
      }),
    ]);

    return res.status(200).json({
      message:
        "Money transferred successfully",
    });
  } catch (error) {
    console.error("Send money error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};