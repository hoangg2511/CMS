const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
require("./config/redis");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// View Engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/admin");

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api", require("./routes/api"));
app.use("/admin", require("./routes/admin"));
app.use("/upload", require("./routes/upload"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
