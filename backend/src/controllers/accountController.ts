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
    const userId = Number(
      req.params.userId
    );

    const account =
      await prisma.account.findUnique({
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
    console.error(error);

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
    const userId = Number(
      req.params.userId
    );

    const amount = Number(
      req.body.amount
    );

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const account =
      await prisma.account.findUnique({
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

    return res.status(200).json({
      message:
        "Money added successfully",

      balance:
        updatedAccount.balance,
    });

  } catch (error) {
    console.error(error);

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
    const userId = Number(
      req.params.userId
    );

    const account =
      await prisma.account.findUnique({
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

    return res.status(200).json(
      transactions
    );

  } catch (error) {
    console.error(error);

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
    const senderId = Number(
      req.params.userId
    );

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
        message:
          "Sender account not found",
      });
    }

    if (
      !recipient ||
      !recipient.account
    ) {
      return res.status(404).json({
        message:
          "Recipient not found",
      });
    }

    if (
      sender.account.balance < money
    ) {
      return res.status(400).json({
        message:
          "Insufficient balance",
      });
    }

    await prisma.$transaction([
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
    ]);

    return res.status(200).json({
      message:
        "Money transferred successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};