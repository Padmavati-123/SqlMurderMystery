import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserCircle, FaArrowRight, FaQuestionCircle } from "react-icons/fa";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const QuizPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", message: "", color: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);  // Track whether the quiz has been submitted

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/questions/${topicId}`)
      .then((res) => {
        setQuestions(res.data);
      })
      .catch((err) => console.error("Error fetching questions:", err));
  }, [topicId]);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch("http://localhost:8080/auth/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleSubmit = () => {
    setIsSubmitted(true);  // Mark quiz as submitted
    axios.post("http://localhost:8080/api/questions/submit", { answers }).then((res) => {
      setResult(res.data);
      const total = res.data.correct.length + res.data.wrong.length;
      const correctCount = res.data.correct.length;

      if (correctCount === total) {
        setPopupContent({
          title: "🎉 Perfect Score!",
          message: "You're a true detective! 🕵️‍♂️",
          color: "green",
        });
      } else if (correctCount / total < 0.5) {
        setPopupContent({
          title: "😢 Tough Case!",
          message: "Don't worry, detectives learn from mistakes.",
          color: "red",
        });
      } else {
        setPopupContent({
          title: "👍 Good Job!",
          message: "You’re close! Try again for a perfect score.",
          color: "yellow",
        });
      }

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-black bg-opacity-50 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center px-6 border-b border-red-700 sticky top-0 z-50">
        <div className="flex items-center">
          <span className="text-3xl mr-2 animate-pulse">🕵️</span>
          <h1 className="text-3xl font-bold tracking-wide">
            <span className="text-yellow-400">SQL</span>
            <span className="text-red-500">Murder</span>
            <span className="text-white">Mystery</span>
          </h1>
        </div>

        <div className="flex space-x-6 items-center">
          <button onClick={() => navigate("/about")} className="nav-link hover:text-yellow-400 font-semibold">About</button>
          <button onClick={() => navigate("/faqs")} className="nav-link hover:text-yellow-400 font-semibold flex items-center gap-2">
            <FaQuestionCircle className="text-red-400" />
            FAQs
          </button>
          <button onClick={() => navigate("/contact")} className="nav-link hover:text-yellow-400 font-semibold">Contact Us</button>

          <div className="relative dropdown-container">
            <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 hover:text-yellow-400 font-semibold">
              <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center">
                <FaUserCircle className="text-xl" />
              </div>
              <span>{user ? user.name : "Account"}</span>
            </button>

            {showDropdown && user && (
              <div className="absolute right-0 mt-2 w-64 bg-black bg-opacity-80 backdrop-blur-md shadow-lg rounded-lg p-4 border border-red-600">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-700">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-400">{user.name}</p>
                    <p className="text-sm text-gray-300">{user.email}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <button className="w-full text-left py-2 px-3 rounded-md hover:bg-red-700 hover:bg-opacity-30 transition flex items-center" onClick={() => navigate("/profile")}>
                    <span>My Profile</span>
                    <FaArrowRight className="ml-auto text-xs opacity-50" />
                  </button>
                  <button className="w-full text-left py-2 px-3 rounded-md hover:bg-red-700 hover:bg-opacity-30 transition flex items-center" onClick={() => navigate("/history")}>
                    <span>Case History</span>
                    <FaArrowRight className="ml-auto text-xs opacity-50" />
                  </button>
                  <button className="mt-3 bg-gradient-to-r from-red-700 to-red-500 w-full py-2 rounded-md hover:from-red-600 hover:to-red-400 transition flex justify-center items-center gap-2 font-medium" onClick={handleLogout}>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className="mb-6 px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">🔙 Back</button>

        {questions.map((q) => (
          <div key={q.id} className="mb-6 p-4 bg-gray-800 rounded-lg shadow-lg border border-yellow-500">
            <p className="font-semibold text-lg text-yellow-400">{q.question}</p>
            {[1, 2, 3, 4].map((num) => (
              <label key={num} className="block mt-3 cursor-pointer">
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value={num}
                  onChange={() => setAnswers({ ...answers, [q.id]: num })}
                  checked={answers[q.id] === num}
                  disabled={isSubmitted} // Disable input after submission
                  className="mr-2"
                />
                <span className="text-gray-300">{q[`option${num}`]}</span>
              </label>
            ))}
            {result && (
              <div className="mt-3">
                {answers[q.id] === q.correctAnswer ? (
                  <p className="text-green-400">✔️ Correct Answer: {q[`option${q.correctAnswer}`]}</p>
                ) : (
                  <>
                    <p className="text-red-400">❌ Your Answer: {q[`option${answers[q.id]}`]}</p>
                    <p className="text-green-400">✔️ Correct Answer: {q[`option${q.correctAnswer}`]}</p>
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        <button onClick={handleSubmit} className="mt-6 px-6 py-2 bg-red-600 text-white font-bold rounded-md transition hover:bg-red-500 shadow-lg">
          🕵️‍♂️ Submit Case Report
        </button>

        {/* Sparkles animation for perfect score */}
        <AnimatePresence>
          {result && result.correct.length === questions.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 text-green-400 animate-pulse"
            >
              ✨ Perfect Score! 🎉
            </motion.div>
          )}
        </AnimatePresence>

        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 bg-${popupContent.color}-700 text-white px-6 py-4 rounded-lg shadow-xl z-50`}
          >
            <h2 className="text-xl font-bold">{popupContent.title}</h2>
            <p className="text-sm">{popupContent.message}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
