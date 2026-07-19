import { Request, Response } from "express";
import prisma from "../lib/prisma";

// ==================== SIGNUP ====================

export const registerUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Create user + account together
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        account: {
          create: {
            balance: 0,
            currency: "INR",
          },
        },
      },
      include: {
        account: true,
      },
    });

    res.status(201).json({
      message: "User registration successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      account: {
        balance: user.account?.balance,
        currency: user.account?.currency,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};


// ==================== LOGIN ====================

export const loginUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        account: true,
      },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      account: {
        balance: user.account?.balance,
        currency: user.account?.currency,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};