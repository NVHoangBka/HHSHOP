require("dotenv").config(); // ĐẦU TIÊN

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

const appRouter = require("./routes/appRoutes");
require("./models");
// Middleware
const allowedOrigins = [
  "http://localhost:3000", // React CRA
];

app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép request không có origin (mobile app, Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }, // Chỉ cho phép frontend này
    credentials: true, // Bắt buộc để gửi cookie httpOnly
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Các method cho phép
    allowedHeaders: ["Content-Type", "Authorization"], // Headers cho phép
  })
);

app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/api", appRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
