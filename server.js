const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const packageInfo = require("./package.json");

const NODE_ENV = process.env.NODE_ENV || "production";
dotenv.config({ path: `.env.${NODE_ENV}` });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    version: packageInfo.version,
    env: NODE_ENV,
    uptime: `${process.uptime().toFixed(2)}s`,
    memoryUsage: process.memoryUsage().rss,
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ status: "error", message: "Internal Server Error" });
});

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`)
);
