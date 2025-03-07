// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUserCircle, FaDatabase, FaGamepad, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

// const Home = () => {
//     const navigate = useNavigate();
//     const [showDropdown, setShowDropdown] = useState(false);

//     return (
//         <div className="min-h-screen bg-gray-900 text-white">
//             {/* Navbar */}
//             <nav className="bg-gray-800 shadow-lg p-4 flex justify-between items-center px-6">
//                 <h1 className="text-2xl font-bold text-green-400">SQL Murder Mystery</h1>

//                 <div className="flex space-x-6">
//                     <button onClick={() => navigate("/about")} className="hover:text-green-400 transition">About</button>
//                     <button onClick={() => navigate("/contact")} className="hover:text-green-400 transition">Contact Us</button>
                    
//                     {/* My Account Dropdown */}
//                     <div className="relative">
//                         <button 
//                             onClick={() => setShowDropdown(!showDropdown)}
//                             className="flex items-center gap-2 hover:text-green-400 transition"
//                         >
//                             <FaUserCircle className="text-xl" />
//                             My Account
//                         </button>

//                         {showDropdown && (
//                             <div className="absolute right-0 mt-2 w-48 bg-gray-700 shadow-md rounded-lg p-3">
//                                 <p className="text-sm text-gray-300">👤 Name: John Doe</p>
//                                 <p className="text-sm text-gray-300">📧 Email: johndoe@example.com</p>
//                                 <button 
//                                     className="mt-3 bg-red-500 w-full py-1 rounded-md hover:bg-red-600 transition"
//                                     onClick={() => alert("Logged out!")}
//                                 >
//                                     Log Out
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </nav>

//             {/* Main Content */}
//             <div className="flex flex-col items-center justify-center min-h-[80vh]">
//                 <h1 className="text-3xl font-bold mb-6 text-green-400">Welcome to the SQL Crime Scene!</h1>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Learn SQL Card */}
//                     <div
//                         className="bg-blue-500 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-blue-600 transition duration-300"
//                         onClick={() => navigate("/topics")}
//                     >
//                         <h2 className="text-xl font-semibold flex items-center gap-2">
//                             <FaDatabase /> Learn SQL
//                         </h2>
//                         <p className="mt-2 text-sm">Understand the basics and advanced concepts of SQL.</p>
//                     </div>

//                     {/* SQL Game Card */}
//                     <div
//                         className="bg-green-500 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-green-600 transition duration-300"
//                         onClick={() => navigate("/sql-game")}
//                     >
//                         <h2 className="text-xl font-semibold flex items-center gap-2">
//                             <FaGamepad /> SQL Game
//                         </h2>
//                         <p className="mt-2 text-sm">Solve SQL problems and enhance your skills.</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Footer */}
//             <footer className="bg-gray-800 p-4 text-center mt-10">
//                 <div className="flex justify-center space-x-6">
//                     <a href="mailto:contact@sqlmystery.com" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition">
//                         <FaEnvelope /> contact@sqlmystery.com
//                     </a>
//                     <span className="text-gray-400">|</span>
//                     <a href="tel:+123456789" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition">
//                         <FaPhoneAlt /> +1 234 567 89
//                     </a>
//                 </div>
//                 <p className="text-gray-500 mt-2">© 2025 SQL Murder Mystery | All Rights Reserved</p>
//             </footer>
//         </div>
//     );
// };

// export default Home;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaDatabase, FaGamepad, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const Home = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
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
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <nav className="bg-gray-800 shadow-lg p-4 flex justify-between items-center px-6">
                <h1 className="text-2xl font-bold text-green-400">SQL Murder Mystery</h1>
                <div className="flex space-x-6">
                    <button onClick={() => navigate("/about")} className="hover:text-green-400 transition">About</button>
                    <button onClick={() => navigate("/contact")} className="hover:text-green-400 transition">Contact Us</button>
                    <div className="relative">
                        <button 
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 hover:text-green-400 transition"
                        >
                            <FaUserCircle className="text-xl" />
                            {user ? user.name : "My Account"}
                        </button>
                        {showDropdown && user && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-700 shadow-md rounded-lg p-3">
                                <p className="text-sm text-gray-300">👤 Name: {user.name}</p>
                                <p className="text-sm text-gray-300">📧 Email: {user.email}</p>
                                <button 
                                    className="mt-3 bg-red-500 w-full py-1 rounded-md hover:bg-red-600 transition"
                                    onClick={handleLogout}
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
                <h1 className="text-3xl font-bold mb-6 text-green-400">Welcome to the SQL Crime Scene!</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                        className="bg-blue-500 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-blue-600 transition duration-300"
                        onClick={() => navigate("/topics")}
                    >
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <FaDatabase /> Learn SQL
                        </h2>
                        <p className="mt-2 text-sm">Understand the basics and advanced concepts of SQL.</p>
                    </div>
                    <div
                        className="bg-green-500 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-green-600 transition duration-300"
                        onClick={() => navigate("/sql-game")}
                    >
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <FaGamepad /> SQL Game
                        </h2>
                        <p className="mt-2 text-sm">Solve SQL problems and enhance your skills.</p>
                    </div>
                </div>
            </div>
            <footer className="bg-gray-800 p-4 text-center mt-10">
                <div className="flex justify-center space-x-6">
                    <a href="mailto:contact@sqlmystery.com" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition">
                        <FaEnvelope /> contact@sqlmystery.com
                    </a>
                    <span className="text-gray-400">|</span>
                    <a href="tel:+123456789" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition">
                        <FaPhoneAlt /> +1 234 567 89
                    </a>
                </div>
                <p className="text-gray-500 mt-2">© 2025 SQL Murder Mystery | All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default Home;


