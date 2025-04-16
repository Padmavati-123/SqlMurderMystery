// import { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from "react-router-dom";
// // import { Card, CardContent } from "../Components/ui/card";
// // import { Button } from "../Components/ui/button";

// import axios from "axios";

// function TopicsPage() {
//     const [topics, setTopics] = useState([]);
  
//     useEffect(() => {
//       axios.get("https://sql-backend-hggtg3ccd8h8fpfv.southindia-01.azurewebsites.net/api/topics").then((res) => setTopics(res.data));
//     }, []);
  
//     return (
//       <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//         {topics.map((topic) => (
//           <Link to={`/description/${topic.id}`} key={topic.id} className="block p-4 border rounded-lg shadow-md text-center hover:shadow-lg transition cursor-pointer">
//           {topic.name}
//         </Link>        
//         ))}
//       </div>
//     );
//   }
  
//   export default TopicsPage;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

function TopicsPage() {
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // Fetch topics
        axios.get("https://sql-backend-hggtg3ccd8h8fpfv.southindia-01.azurewebsites.net/api/topics").then((res) => setTopics(res.data));

        // Fetch user data
        const fetchUserData = async () => {
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
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen text-white relative bg-gray-900" style={{
            backgroundImage: "url('/topics_background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}>
            {/* Navbar */}
            <nav className="bg-black bg-opacity-70 backdrop-blur-md shadow-lg p-4 flex justify-between items-center px-6 border-b border-blue-500">
                <h1 className="text-3xl font-bold text-cyan-400 tracking-wide">📚 SQL Topics</h1>
                <div className="flex space-x-6">
                    <button onClick={() => navigate("/home")} className="hover:text-cyan-400 transition font-semibold px-3 py-1 rounded-md hover:bg-blue-900 hover:bg-opacity-30">Home</button>
                    <button onClick={() => navigate("/faqs")} className="hover:text-cyan-400 transition font-semibold px-3 py-1 rounded-md hover:bg-blue-900 hover:bg-opacity-30">FAQs</button>
                    <button onClick={() => navigate("/contact")} className="hover:text-cyan-400 transition font-semibold px-3 py-1 rounded-md hover:bg-blue-900 hover:bg-opacity-30">Contact</button>
                    <div className="relative">
                        <button 
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 hover:text-blue-400 transition font-semibold"
                        >
                            <FaUserCircle className="text-xl" />
                            {user ? user.name : "My Account"}
                        </button>
                        {showDropdown && user && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 bg-opacity-80 backdrop-blur-md shadow-md rounded-lg p-3 border border-blue-500 transition-all duration-300 ease-in-out">
                                <div className="flex flex-col space-y-2">
                                    <p className="text-sm text-gray-300 border-b border-gray-600 pb-2">👤 {user.name}</p>
                                    <p className="text-sm text-gray-300 pb-2">📧 {user.email}</p>
                                    <button 
                                        className="mt-1 bg-gradient-to-r from-red-600 to-red-700 w-full py-1.5 rounded-md hover:from-red-700 hover:to-red-800 transition font-medium"
                                        onClick={handleLogout}
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Page Header */}
            <div className="text-center py-8">
                <h1 className="text-4xl font-bold text-cyan-400 mb-2">SQL Learning Topics</h1>
                <p className="text-gray-300 max-w-2xl mx-auto">Master SQL concepts through our carefully curated topics and interactive exercises.</p>
            </div>

            {/* Loading State */}
            {topics.length === 0 && (
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto"></div>
                        <p className="mt-4 text-gray-300">Loading topics...</p>
                    </div>
                </div>
            )}

            {/* Topics Grid */}
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                        {topics.length} Topics Available
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {topics.map((topic) => (
                        <Link to={`/description/${topic.id}`} key={topic.id} className="group relative overflow-hidden bg-gray-800 bg-opacity-90 backdrop-blur-lg text-white p-6 rounded-lg shadow-lg border border-blue-500 transition duration-300 transform hover:scale-105 hover:border-cyan-400 hover:rotate-1 hover:shadow-xl hover:shadow-blue-900/20">
                            <h2 className="text-xl font-semibold group-hover:text-cyan-400 transition">{topic.name}</h2>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-50 group-hover:opacity-75 transition"></div>
                        </Link>        
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-black bg-opacity-60 backdrop-blur-md p-6 text-center mt-10 border-t border-blue-500">
                <div className="max-w-6xl mx-auto">
                    <p className="text-cyan-400 font-semibold">SQL Murder Mystery</p>
                    <p className="text-gray-400 mt-2">© 2025 | All Rights Reserved</p>
                    <div className="mt-4 text-gray-500 text-sm">
                        <a href="#" className="hover:text-cyan-400 transition mx-2">Privacy Policy</a>
                        <a href="#" className="hover:text-cyan-400 transition mx-2">Terms of Service</a>
                        <a href="#" className="hover:text-cyan-400 transition mx-2">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default TopicsPage;
