import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get User Profile
export const getUserProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Update User Profile
export const updateUserProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const updatedUser =
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
          email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};