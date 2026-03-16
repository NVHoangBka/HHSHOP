require("dotenv").config(); // ĐẦU TIÊN

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

const appRouter = require("./routes/appRoutes");
require("./models");

app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin);
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/api", appRouter);

app.get("/", (req, res) => {
  res.send("HHSHOP Backend API is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
