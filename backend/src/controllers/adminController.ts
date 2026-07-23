import { Request, Response } from "express";

import prisma from "../lib/prisma";

export const getAdminStats = async (
  req: Request,
  res: Response
) => {
  try {
    const totalUsers =
      await prisma.user.count();

    const totalAccounts =
      await prisma.account.count();

    const totalCards =
      await prisma.card.count();

    const totalTransactions =
      await prisma.transaction.count();

    const totalBudgets =
      await prisma.budget.count();

    const balanceResult =
      await prisma.account.aggregate({
        _sum: {
          balance: true,
        },
      });

    const totalBalance =
      balanceResult._sum.balance || 0;

    res.status(200).json({
      totalUsers,
      totalAccounts,
      totalCards,
      totalTransactions,
      totalBudgets,
      totalBalance,
    });

  } catch (error) {
    console.error(
      "Failed to fetch admin stats:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch admin stats",
    });
  }
};