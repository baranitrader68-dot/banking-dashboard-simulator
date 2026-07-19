import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get Account Balance
export const getAccountBalance = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);

    const account = await prisma.account.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    res.status(200).json({
      balance: account.balance,
      currency: account.currency,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};


// Add Money
export const addMoney = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Enter a valid amount",
      });
    }

    const account = await prisma.account.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const updatedAccount = await prisma.account.update({
      where: {
        userId: userId,
      },
      data: {
        balance: {
          increment: amount,
        },
        transactions: {
          create: {
            type: "CREDIT",
            amount: amount,
            description: "Money Added",
          },
        },
      },
    });

    res.status(200).json({
      message: "Money added successfully",
      balance: updatedAccount.balance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};