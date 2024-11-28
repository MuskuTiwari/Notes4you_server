const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: [
"https://notes4youapp.netlify.app",
      "https://notes4you-client.vercel.app",
      "http://localhost:5174",
      "http://localhost:5173",
    ],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

// Simple status endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is working!",
  });
});

// Routes
const authRouter = require("./routes/auth.route.js");
const noteRouter = require("./routes/note.route.js");

app.use("/api/auth", authRouter);
app.use("/api/note", noteRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err); // Log error details
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Export the app for Vercel
module.exports = app;
