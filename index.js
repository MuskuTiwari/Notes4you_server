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
// const allowedOrigins = [
//   "http://localhost:5173", // Production URL
//   "http://localhost:3000", // Local development URL
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (allowedOrigins.includes(origin) || !origin) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: [""],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
