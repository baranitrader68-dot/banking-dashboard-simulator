import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get Authorization header
    const authHeader =
      req.headers.authorization;

    // Check token exists
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message:
          "Authorization token missing",
      });
    }

    // Extract token
    const token =
      authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    // Store decoded user data
    (req as any).user = decoded;

    // Continue to controller
    next();

  } catch (error) {
    console.error(
      "JWT verification failed:",
      error
    );

    return res.status(401).json({
      message:
        "Invalid or expired token",
    });
  }
};