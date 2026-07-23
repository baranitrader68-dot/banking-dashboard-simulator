import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Create Virtual Card
export const createCard = async (
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
      include: {
        user: true,
      },
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // Check existing card
    const existingCard =
      await prisma.card.findFirst({
        where: {
          accountId: account.id,
        },
      });

    if (existingCard) {
      return res.status(400).json({
        message: "Card already exists",
      });
    }

    // Generate random card number
    const cardNumber =
      "4532" +
      Math.floor(
        100000000000 +
          Math.random() * 900000000000
      ).toString();

    // Generate expiry date
    const expiryDate = "12/30";

    // Generate CVV
    const cvv = Math.floor(
      100 + Math.random() * 900
    ).toString();

    // Create card
    const card = await prisma.card.create({
      data: {
        cardNumber: cardNumber,
        cardHolder: account.user.name,
        expiryDate: expiryDate,
        cvv: cvv,
        accountId: account.id,
      },
    });

    res.status(201).json({
      message: "Card created successfully",
      card: card,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};


// Get User Card
export const getCard = async (
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

    // Find card
    const card = await prisma.card.findFirst({
      where: {
        accountId: account.id,
      },
    });

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    res.status(200).json(card);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};