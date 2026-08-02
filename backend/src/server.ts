import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/authRoutes";
import accountRoutes from "./routes/accountRoutes";
import cardRoutes from "./routes/cardRoutes";
import budgetRoutes from "./routes/budgetRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import transferRoutes from "./routes/transferRoutes";

dotenv.config();

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// =========================
// ROUTES
// =========================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/account",
  accountRoutes
);

app.use(
  "/api/card",
  cardRoutes
);

app.use(
  "/api/budget",
  budgetRoutes
);

app.use(
  "/api/notification",
  notificationRoutes
);

app.use(
  "/api/user",
  userRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/transfer",
  transferRoutes
);

// =========================
// TEST ROUTE
// =========================

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      message:
        "Banking Dashboard API is running 🚀",
    });
  }
);

// =========================
// SERVER
// =========================

const PORT =
  Number(process.env.PORT) || 5000;

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);