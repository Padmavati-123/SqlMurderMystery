require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path"); // Make sure path is imported!
const bodyParser = require("body-parser");
const authRoutes = require("./Routes/AuthRoutes");
const topicsRoutes = require("./Routes/TopicsRoutes");
const questionsRoutes = require("./Routes/QuestionsRoutes");
const level1Routes = require("./Routes/Level1Routes");
const leaderboardRoutes = require("./Routes/LeaderboardRoutes");
const level2Routes = require("./Routes/Level2Routes");
const level3Routes = require("./Routes/Level3Routes");

const app = express();
app.use(cors({
  origin: 'https://sql-murder-mystery.vercel.app',
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Access-Control-Allow-Origin"]
}));



app.use(express.json());

app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/api", topicsRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api", level1Routes);
app.use("/api", level2Routes);
app.use("/api", level3Routes);
app.use("/api", leaderboardRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "Frontend", "dist")));

  // Serve frontend only for routes not starting with /api or /auth
  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/auth")) {
      return next(); // Skip to actual API route
    }
    res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
  });
}


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
