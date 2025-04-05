require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./Routes/AuthRoutes");
const topicsRoutes = require("./Routes/TopicsRoutes");
const questionsRoutes = require("./Routes/QuestionsRoutes");
const level1Routes = require("./Routes/Level1Routes");
const leaderboardRoutes = require("./Routes/LeaderboardRoutes");
const level2Routes = require("./Routes/Level2Routes");

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));

app.use(express.json());

app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/api", topicsRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api", level1Routes);
app.use("/api", level2Routes);
app.use("/api", leaderboardRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
