import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../lib/prisma";

// ==================== SIGNUP / REGISTER ====================

export const registerUser = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,

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

    return res.status(201).json({
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
  } catch (error: any) {
    console.error("SIGNUP ERROR:", error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: error.code || error,
    });
  }
};

// ==================== LOGIN ====================

export const loginUser = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },

        include: {
          account: true,
        },
      });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },

      process.env.JWT_SECRET as string,

      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful",

      token,

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
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: error.code || error,
    });
  }
};