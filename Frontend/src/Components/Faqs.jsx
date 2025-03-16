import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaDatabase, FaGamepad, FaEnvelope, FaArrowRight } from "react-icons/fa6";
import { FaUserCircle, FaPhoneAlt, FaQuestionCircle, FaSearch } from "react-icons/fa";

const FAQsPage = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Close dropdown when clicking outside
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

    const faqs = [
        {
            question: "What is SQL Murder Mystery?",
            answer: "SQL Murder Mystery is an interactive SQL-based game where you solve a crime using database queries."
        },
        {
            question: "Do I need SQL knowledge to play?",
            answer: "Basic SQL knowledge is recommended, but hints and learning resources are available for beginners."
        },
        {
            question: "How do I start solving the case?",
            answer: "You'll be given an initial clue and access to a database. Use SQL queries to gather evidence and solve the mystery!"
        },
        {
            question: "Is the game free to play?",
            answer: "Yes! The SQL Murder Mystery game is completely free and designed to help you practice SQL skills."
        },
        {
            question: "Where can I find hints if I'm stuck?",
            answer: "Check the ‘Learn SQL’ section on our website for query hints, or visit the community forum for discussions."
        }
    ];

    return (
        <div className="min-h-screen text-white bg-gray-900" style={{
            backgroundImage: "url('/faqs_background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}>
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
                    <button
                        onClick={() => navigate("/about")}
                        className="nav-link relative overflow-hidden hover:text-yellow-400 transition duration-300 font-semibold"
                    >
                        <span>About</span>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 hover-line"></span>
                    </button>

                    <button
                        onClick={() => navigate("/home")}
                        className="nav-link relative overflow-hidden hover:text-yellow-400 transition duration-300 font-semibold flex items-center gap-2"
                    >
                        {/* <FaQuestionCircle className="text-red-400" /> */}
                        <span>Home</span>
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

            {/* FAQs Section */}
            <div className="flex flex-col items-center justify-center py-16">
                <h1 className="text-4xl font-extrabold mb-10 text-red-500 flex items-center gap-2">
                    <FaQuestionCircle /> Frequently Asked Questions
                </h1>
                <div className="w-full max-w-3xl space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg border border-red-600">
                            <button
                                className="w-full flex justify-between items-center text-lg font-semibold text-white hover:text-red-400 transition"
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                            >
                                {faq.question}
                                <span className="text-red-500">{activeIndex === index ? "▲" : "▼"}</span>
                            </button>
                            {activeIndex === index && (
                                <p className="mt-2 text-gray-300">{faq.answer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-black bg-opacity-60 backdrop-blur-md p-4 text-center mt-10 border-t border-red-700">
                <p className="text-gray-500">© 2025 SQL Murder Mystery | All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default FAQsPage;
