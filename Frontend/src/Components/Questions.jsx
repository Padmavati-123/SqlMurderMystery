import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaDatabase, FaGamepad, FaEnvelope, FaArrowRight } from "react-icons/fa6"; 
import { FaUserCircle, FaPhoneAlt, FaQuestionCircle, FaSearch } from "react-icons/fa"; 
import axios from "axios";

const QuizPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/questions/${topicId}`)
      .then((res) => {
        console.log("Questions API Response:", res.data);
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
    axios.post("http://localhost:8080/api/questions/submit", { answers }).then((res) => {
      setResult(res.data);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  

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
      {/* 🕵️‍♂️ Navbar */}
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
          <button
            onClick={() => navigate("/about")}
            className="nav-link relative overflow-hidden hover:text-yellow-400 transition duration-300 font-semibold"
          >
            <span>About</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 hover-line"></span>
          </button>

          <button
            onClick={() => navigate("/faqs")}
            className="nav-link relative overflow-hidden hover:text-yellow-400 transition duration-300 font-semibold flex items-center gap-2"
          >
            <FaQuestionCircle className="text-red-400" />
            <span>FAQs</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 hover-line"></span>
          </button>

          <button
            onClick={() => navigate("/contact")}
            className="nav-link relative overflow-hidden hover:text-yellow-400 transition duration-300 font-semibold"
          >
            <span>Contact Us</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 hover-line"></span>
          </button>

          <div className="relative dropdown-container">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 hover:text-yellow-400 transition duration-300 font-semibold px-3 py-1 rounded-full border border-transparent hover:border-yellow-400"
            >
              <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center overflow-hidden">
                <FaUserCircle className="text-xl" />
              </div>
              <span>{user ? user.name : "Account"}</span>
            </button>

            {showDropdown && user && (
              <div className="absolute right-0 mt-2 w-64 bg-black bg-opacity-80 backdrop-blur-md shadow-lg rounded-lg p-4 border border-red-600 transform origin-top-right transition-all duration-300 animate-fadeIn">
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
                  <button
                    className="w-full text-left py-2 px-3 rounded-md hover:bg-red-700 hover:bg-opacity-30 transition flex items-center"
                    onClick={() => navigate("/profile")}
                  >
                    <span>My Profile</span>
                    <FaArrowRight className="ml-auto text-xs opacity-50" />
                  </button>

                  <button
                    className="w-full text-left py-2 px-3 rounded-md hover:bg-red-700 hover:bg-opacity-30 transition flex items-center"
                    onClick={() => navigate("/history")}
                  >
                    <span>Case History</span>
                    <FaArrowRight className="ml-auto text-xs opacity-50" />
                  </button>

                  <button
                    className="mt-3 bg-gradient-to-r from-red-700 to-red-500 w-full py-2 rounded-md hover:from-red-600 hover:to-red-400 transition flex justify-center items-center gap-2 font-medium"
                    onClick={handleLogout}
                  >
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>


      <div className="max-w-3xl mx-auto p-6">
        {/* 🚔 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
        >
          🔙 Back
        </button>

        {/* 📝 Questions List */}
        {questions.map((q) => (
          <div key={q.id} className="mb-6 p-4 bg-gray-800 rounded-lg shadow-lg border border-yellow-500 relative">
            {/* <span className="absolute top-2 left-3 text-red-600 text-xl">📌</span> */}
            <p className="font-semibold text-lg text-yellow-400">{q.question}</p>

            {/* Answer Options */}
            {[1, 2, 3, 4].map((num) => (
              <label key={num} className="block mt-3 cursor-pointer">
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value={num}
                  onChange={() => setAnswers({ ...answers, [q.id]: num })}
                  checked={answers[q.id] === num}
                  className="mr-2"
                />
                <span className="text-gray-300">{q[`option${num}`]}</span>
              </label>
            ))}
          </div>
        ))}

        {/* 🚨 Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-6 px-6 py-2 bg-red-600 text-white font-bold rounded-md transition hover:bg-red-500 shadow-lg"
        >
          🕵️‍♂️ Submit Case Report
        </button>

        {/* 📄 Result Section */}
        {result && (
          <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow-lg border border-green-500">
            <h2 className="text-2xl font-bold text-green-400">📝 Investigation Report</h2>
            <p className="mt-2">✅ Correct Answers: <span className="text-green-300">{result.correct.length}</span></p>
            <p className="mt-1">❌ Wrong Answers: <span className="text-red-300">{result.wrong.length}</span></p>

            <h3 className="mt-4 font-semibold text-yellow-400">🔍 Correct Answers:</h3>
            {questions.map((q) => (
              <p key={q.id} className="mt-2 text-gray-300">
                {q.question}:
                <span className="text-green-400 ml-2">
                  {q.correctAnswer && q[`option${q.correctAnswer}`] ? q[`option${q.correctAnswer}`] : "Answer not available"}
                </span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
