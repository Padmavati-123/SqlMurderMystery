import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {FaFingerprint, FaBookOpen, FaExclamationTriangle } from "react-icons/fa";
import { FaDatabase, FaGamepad, FaEnvelope, FaArrowRight } from "react-icons/fa6"; 
import { FaUserCircle, FaPhoneAlt, FaQuestionCircle, FaSearch } from "react-icons/fa"; 
import { motion } from "framer-motion";

const AboutPage = () => {
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
                const response = await fetch("https://sql-backend-hggtg3ccd8h8fpfv.southindia-01.azurewebsites.net/auth/user", {
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
        <div className="min-h-screen bg-black text-white" style={{
            backgroundImage: "url('/crime_scene.jpg')",
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
                        onClick={() => navigate("/home")}
                        className="nav-link relative overflow-hidden hover:text-yellow-400 transition duration-300 font-semibold"
                    >
                        <span>Home</span>
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

            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <motion.h1
                    className="text-5xl font-extrabold text-red-500 mb-6"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    About SQL Murder Mystery 🔎
                </motion.h1>

                <motion.p
                    className="text-lg text-gray-300 max-w-3xl mb-6 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                >
                    Welcome, Detective! 🕵️ You've been assigned a **murder case** that can only be solved using **SQL skills**.
                    Dive into a crime-infested world where **data holds the key to justice**. Can you crack the case?
                </motion.p>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                >

                    <motion.div
                        className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg border border-red-600 text-center hover:scale-105 transition"
                        whileHover={{ scale: 1.1 }}
                    >
                        <FaFingerprint className="text-4xl text-red-500 mb-3" />
                        <h3 className="text-xl font-semibold text-gray-100">Investigate Crime Scenes</h3>
                        <p className="text-gray-400 mt-2">Use SQL queries to uncover evidence hidden in databases.</p>
                    </motion.div>

                    <motion.div
                        className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg border border-red-600 text-center hover:scale-105 transition"
                        whileHover={{ scale: 1.1 }}
                    >
                        <FaBookOpen className="text-4xl text-red-500 mb-3" />
                        <h3 className="text-xl font-semibold text-gray-100">Solve Mysteries</h3>
                        <p className="text-gray-400 mt-2">Follow the clues and connect the dots to find the murderer.</p>
                    </motion.div>

                    <motion.div
                        className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg border border-red-600 text-center hover:scale-105 transition"
                        whileHover={{ scale: 1.1 }}
                    >
                        <FaExclamationTriangle className="text-4xl text-red-500 mb-3" />
                        <h3 className="text-xl font-semibold text-gray-100">Enhance SQL Skills</h3>
                        <p className="text-gray-400 mt-2">Practice and improve your database query skills in a fun way.</p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="bg-black bg-opacity-60 backdrop-blur-md p-4 text-center mt-10 border-t border-red-700">
                <p className="text-gray-500">© 2025 SQL Murder Mystery | All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default AboutPage;
