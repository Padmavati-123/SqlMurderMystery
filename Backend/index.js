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
const level3Routes = require("./Routes/Level3Routes");

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'https://sql-murder-mystery.vercel.app/'],
  credentials: true 
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


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
  app.use(express.static("Frontend/dist")); 
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html")); 
  });
}


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
