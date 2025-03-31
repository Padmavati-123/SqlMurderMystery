const pool = require("../Config/db");

exports.getTopics = (req, res) => {
  pool.query("SELECT * FROM topics", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};
