import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    try {
      setLoading(true);
      const response = await axios.get(
        'https://sql-backend-hggtg3ccd8h8fpfv.southindia-01.azurewebsites.net/api/leaderboard',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
            // Add any other required headers here
          }
        }
      );
      setLeaderboard(response.data.leaderboard);
      setLoading(false);
    } catch (err) {
      setError('Failed to load leaderboard');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">SQL Mystery Leaderboard</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-6 py-3 text-left">Rank</th>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-right">Score</th>
              <th className="px-6 py-3 text-right">Current Streak</th>
              <th className="px-6 py-3 text-right">Best Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaderboard.map((user, index) => (
              <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium">
                  {user.name}
                  {index < 3 && (
                    <span className="ml-2">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">{user.total_score}</td>
                <td className="px-6 py-4 text-right">
                  {user.current_streak > 0 && (
                    <span className="flex items-center justify-end">
                      {user.current_streak} <span className="ml-1">🔥</span>
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">{user.highest_streak}</td>
              </tr>
            ))}
            
            {leaderboard.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No data available yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;