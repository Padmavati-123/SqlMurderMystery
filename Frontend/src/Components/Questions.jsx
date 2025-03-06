import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function QuizPage() {
  const { topicId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  //   useEffect(() => {
  //     axios.get(`http://localhost:8080/api/questions/${topicId}`).then((res) => {
  //       setQuestions(res.data);
  //     });
  //   }, [topicId]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/questions/${topicId}`)
      .then((res) => {
        console.log("Questions API Response:", res.data);
        setQuestions(res.data);
      })
      .catch((err) => console.error("Error fetching questions:", err));
  }, [topicId]);


  const handleSubmit = () => {
    axios.post("http://localhost:8080/api/questions/submit", { answers }).then((res) => {
      setResult(res.data);
    });
  };

  return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 rounded">Back</button>

      {questions.map((q) => (
        <div key={q.id} className="mb-4 p-4 border rounded-lg">
          <p className="font-semibold">{q.question}</p>
          {[1, 2, 3, 4].map((num) => (
            <label key={num} className="block mt-2">
              <input
                type="radio"
                name={`q${q.id}`}
                value={num}
                onChange={() => setAnswers({ ...answers, [q.id]: num })}
                checked={answers[q.id] === num}
                className="mr-2"
              />
              {q[`option${num}`]}
            </label>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Submit</button>

      {result && (
        <div className="mt-4 p-4 border rounded-lg">
          <p>Correct Answers: {result.correct.length}</p>
          <p>Wrong Answers: {result.wrong.length}</p>

          <h3 className="mt-4 font-semibold">Correct Answers:</h3>
          {questions.map((q) => (
            <p key={q.id} className="mt-2">
              {q.question}:
              <span className="text-green-500">
                {q.correctAnswer && q[`option${q.correctAnswer}`] ? q[`option${q.correctAnswer}`] : "Answer not available"}
              </span>
            </p>
          ))}

        </div>
      )}

    </div>
  );
}

export default QuizPage;
