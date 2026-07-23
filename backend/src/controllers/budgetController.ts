import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Create Budget
export const createBudget = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);

    const { category, amount } = req.body;

    // Validate input
    if (
      !category ||
      typeof category !== "string" ||
      !amount ||
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        message: "Enter valid category and amount",
      });
    }

    const budgetAmount = Number(amount);

    // Find account
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

    // Check duplicate category
    const existingBudget =
      await prisma.budget.findFirst({
        where: {
          accountId: account.id,
          category: {
            equals: category.trim(),
            mode: "insensitive",
          },
        },
      });

    if (existingBudget) {
      return res.status(400).json({
        message: `${category} budget already exists`,
      });
    }

    // Create budget
    const budget = await prisma.budget.create({
      data: {
        category: category.trim(),
        amount: budgetAmount,
        accountId: account.id,
      },
    });

    res.status(201).json({
      message: "Budget created successfully",
      budget: budget,
    });
  } catch (error) {
    console.error("Create Budget Error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};


// Get Budgets
export const getBudgets = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);

    // Find account
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

    // Get all budgets
    const budgets = await prisma.budget.findMany({
      where: {
        accountId: account.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(budgets);
  } catch (error) {
    console.error("Get Budgets Error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};