import express = require("express");
import cors = require("cors");
import dotenv = require("dotenv");

import authRoutes from "./routes/authRoutes";
import accountRoutes from "./routes/accountRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Account routes
app.use("/api/account", accountRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    message: "Banking Dashboard API is running 🚀",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});