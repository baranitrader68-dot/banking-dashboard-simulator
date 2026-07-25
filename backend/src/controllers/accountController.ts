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

    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
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

    return res.status(200).json({
      balance: Number(account.balance),
      currency: account.currency || "INR",
    });
  } catch (error) {
    console.error("GET BALANCE ERROR:", error);

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

    const updatedAccount = await prisma.account.update({
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
      message: "Money added successfully",
      balance: Number(updatedAccount.balance),
      currency: updatedAccount.currency,
    });
  } catch (error) {
    console.error("ADD MONEY ERROR:", error);

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

    return res.status(200).json(
      transactions.map((transaction) => ({
        ...transaction,
        amount: Number(transaction.amount),
      }))
    );
  } catch (error) {
    console.error("GET TRANSACTIONS ERROR:", error);

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
    } = req.body