const pool = require('../Config/db');

exports.getQuestionsByTopic = (req, res) => {
  const topicId = req.params.topic_id;

  pool.query(
    "SELECT id, question, option1, option2, option3, option4, correct_option FROM questions WHERE topic_id = ?",
    [topicId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const formattedResults = results.map(q => ({
        id: q.id,
        question: q.question,
        option1: q.option1,
        option2: q.option2,
        option3: q.option3,
        option4: q.option4,
        correctAnswer: q.correct_option,
      }));

      res.json(formattedResults);
    }
  );
};


exports.submitAnswers = (req, res) => {
  const userAnswers = req.body.answers;

  pool.query("SELECT id, correct_option FROM questions WHERE id IN (?)", [Object.keys(userAnswers)], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    let correct = [];
    let wrong = [];

    results.forEach((q) => {
      if (parseInt(userAnswers[q.id]) === q.correct_option) {
        correct.push(q.id);
      } else {
        wrong.push(q.id);
      }
    });

    res.json({ correct, wrong });
  });
};


