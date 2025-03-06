require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./Routes/AuthRoutes");
const topicsRoutes = require("./Routes/TopicsRoutes");
const questionsRoutes = require("./Routes/QuestionsRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
// Use Routes
app.use("/api", topicsRoutes);
app.use("/api/questions", questionsRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
