import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaDatabase, FaGamepad, FaEnvelope, FaArrowRight } from "react-icons/fa6"; 
import { FaUserCircle, FaPhoneAlt, FaQuestionCircle, FaSearch } from "react-icons/fa"; 


import Typewriter from "typewriter-effect";

const Home = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState(null);
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
        <div className="min-h-screen text-white relative" style={{
            backgroundImage: "url('/home_background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}>
            {/* Animated overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 z-0">
                {/* Animated particles */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-yellow-500 opacity-20"
                        style={{
                            width: Math.random() * 6 + 2 + "px",
                            height: Math.random() * 6 + 2 + "px",
                            left: Math.random() * 100 + "%",
                            top: Math.random() * 100 + "%",
                            animation: `floatParticle ${Math.random() * 15 + 10}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10">
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
                                            // onClick={() => navigate("/history")}
                                            onClick={() => navigate("/game-dashboard")}

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

                {/* Hero Section with animated entrance */}
                <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                    <div className="animate-fadeInUp">
                        <h1 className="text-5xl font-extrabold mb-6 text-center">
                            <span className="text-red-500">Welcome to the</span>
                            <div className="text-6xl mt-2 text-yellow-400 drop-shadow-lg glow-effect">
                                <Typewriter
                                    options={{
                                        strings: ["SQL Crime Scene!", "Murder Mystery Database!", "Detective SQL Challenge!"],
                                        autoStart: true,
                                        loop: true,
                                        delay: 80,
                                        deleteSpeed: 50,
                                    }}
                                />
                            </div>
                        </h1>

                        <p className="text-center max-w-2xl mx-auto text-lg mb-8 text-gray-200">
                            Put your SQL skills to the test and solve crimes using database queries.
                            Can you follow the evidence and catch the culprit?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl animate-fadeInUp animation-delay-300">
                        <div
                            className="bg-black bg-opacity-60 backdrop-blur-sm text-white p-6 rounded-lg shadow-lg border border-red-600 transform hover:scale-105 transition duration-500 cursor-pointer group relative overflow-hidden"
                            onClick={() => navigate("/topics")}
                        >
                            <div className="absolute -inset-1 bg-blue-500 opacity-0 group-hover:opacity-20 rounded-lg blur transition duration-500 group-hover:duration-200"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-blue-900 bg-opacity-70 rounded-lg flex items-center justify-center">
                                        <FaDatabase className="text-blue-400 text-2xl" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-blue-400">Learn SQL</h2>
                                </div>

                                <p className="mt-2">Master the database query language used by detectives to solve digital mysteries.</p>

                                <div className="mt-4 flex justify-between items-center">
                                    <button className="flex items-center gap-2 text-blue-400 font-semibold group-hover:translate-x-2 transition-all duration-300">
                                        Start Learning <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-black bg-opacity-60 backdrop-blur-sm text-white p-6 rounded-lg shadow-lg border border-red-600 transform hover:scale-105 transition duration-500 cursor-pointer group relative overflow-hidden"
                            onClick={() => navigate("/sql-game")}
                        >
                            <div className="absolute -inset-1 bg-green-500 opacity-0 group-hover:opacity-20 rounded-lg blur transition duration-500 group-hover:duration-200"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-green-900 bg-opacity-70 rounded-lg flex items-center justify-center">
                                        <FaGamepad className="text-green-400 text-2xl" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-400">SQL Game</h2>
                                </div>

                                <p className="mt-2">Solve SQL crimes and enhance your detective skills in an interactive mystery game.</p>

                                <div className="mt-4 flex justify-between items-center">
                                    {/* <span className="text-sm text-gray-400">3 cases available</span> */}
                                    <button className="flex items-center gap-2 text-green-400 font-semibold group-hover:translate-x-2 transition-all duration-300">
                                        Solve Cases <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 animate-fadeInUp animation-delay-500">
                        <button
                            onClick={() => navigate("/level1")}
                            className="bg-gradient-to-r from-red-700 to-yellow-600 hover:from-red-600 hover:to-yellow-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-lg"
                        >
                            <FaSearch className="text-xl" />
                            <span>Start New Investigation</span>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-black bg-opacity-50 backdrop-blur-sm p-6 text-center border-t border-red-700 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                            <div className="mb-4 md:mb-0">
                                <h3 className="text-2xl font-bold mb-2">
                                    <span className="text-yellow-400">SQL</span>
                                    <span className="text-red-500">Murder</span>
                                    <span className="text-white">Mystery</span>
                                </h3>
                                <p className="text-gray-400">The ultimate SQL detective experience</p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4">
                                <a href="mailto:contact@sqlmystery.com" className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition duration-300">
                                    <FaEnvelope /> contact@sqlmystery.com
                                </a>
                                <a href="tel:+123456789" className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition duration-300">
                                    <FaPhoneAlt /> +1 234 567 89
                                </a>
                                <a href="tel:+123456789" className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition duration-300">
                                    <FaPhoneAlt /> +1 234 567 89
                                </a>
                            </div>
                        </div>

                        <div className="border-t border-gray-700 pt-4">
                            <div className="flex flex-wrap justify-center gap-6 mb-4">
                                <a href="/privacy" className="text-sm text-gray-400 hover:text-yellow-400 transition duration-300">Privacy Policy</a>
                                <a href="/terms" className="text-sm text-gray-400 hover:text-yellow-400 transition duration-300">Terms of Service</a>
                                <a href="/faq" className="text-sm text-gray-400 hover:text-yellow-400 transition duration-300">FAQ</a>
                                <a href="/support" className="text-sm text-gray-400 hover:text-yellow-400 transition duration-300">Support</a>
                            </div>
                            <p className="text-sm text-gray-500">© {new Date().getFullYear()} SQL Murder Mystery. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes floatParticle {
                    0% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-100px) rotate(180deg);
                    }
                    100% {
                        transform: translateY(0) rotate(360deg);
                    }
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 1s ease forwards;
                }
                
                .animation-delay-300 {
                    animation-delay: 300ms;
                }
                
                .animation-delay-500 {
                    animation-delay: 500ms;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .glow-effect {
                    text-shadow: 0 0 10px rgba(252, 211, 77, 0.5), 0 0 20px rgba(252, 211, 77, 0.3);
                }
                
                .nav-link:hover .hover-line {
                    width: 100%;
                }
                
                .animate-pulse {
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;
