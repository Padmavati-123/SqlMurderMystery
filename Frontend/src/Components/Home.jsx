import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">THIS IS HOME</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Learn SQL Card */}
                <div
                    className="bg-blue-500 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-blue-600 transition duration-300"
                    onClick={() => navigate("/topics")}
                >
                    <h2 className="text-xl font-semibold">Learn SQL</h2>
                    <p className="mt-2 text-sm">Understand the basics and advanced concepts of SQL.</p>
                </div>

                {/* Practice SQL Card */}
                <div
                    className="bg-green-500 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-green-600 transition duration-300"
                    onClick={() => navigate("/sql-game")}
                >
                    <h2 className="text-xl font-semibold">SQL Game</h2>
                    <p className="mt-2 text-sm">Solve SQL problems and enhance your skills.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
