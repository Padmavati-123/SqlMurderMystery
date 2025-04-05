import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Trophy, Home, User, LogOut, Menu, X, ChevronRight, Search } from 'lucide-react';
import { FaUserCircle, FaQuestionCircle, FaArrowRight } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({ name: "Detective007", email: "detective007@example.com" });

  const levels = [
    { id: 1, title: "LEVEL 1 ", difficulty: "Easy", completed: false },
    { id: 2, title: "LEVEL 2", difficulty: "Medium", completed: false },
    { id: 3, title: "LEVEL 3", difficulty: "Hard", completed: false },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const userResponse = await fetch("http://localhost:8080/auth/user", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const userData = await userResponse.json();
            if (userResponse.ok) {
              setUser(userData);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }

        const leaderboardResponse = await fetch('/api/leaderboard');
        if (!leaderboardResponse.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const leaderboardResult = await leaderboardResponse.json();

        const processedLeaderboardData = leaderboardResult.leaderboard.map((player, index) => ({
          ...player,
          rank: index + 1 
        }));
        
        setLeaderboardData(processedLeaderboardData);

        if (token) {
          const statsResponse = await fetch('/api/user/stats', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (statsResponse.ok) {
            const statsResult = await statsResponse.json();
            setUserStats(statsResult.stats);
            const totalCases = 5;
            const percentage = (statsResult.stats.levels_completed / totalCases) * 100;
            
            setUserProgress({
              completedCases: statsResult.stats.levels_completed,
              totalCases: totalCases,
              percentage: percentage,
            });

            const updatedLevels = levels.map(level => ({
              ...level,
              completed: level.id <= statsResult.stats.levels_completed
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        const mockLeaderboardData = [
          { rank: 1, name: "SQLSherlock", total_score: 980, current_streak: 5, highest_streak: 5 },
          { rank: 2, name: "QueryDetective", total_score: 925, current_streak: 4, highest_streak: 4 },
          { rank: 3, name: "JoinMaster", total_score: 870, current_streak: 3, highest_streak: 4 },
          { rank: 4, name: "SelectSleuth", total_score: 810, current_streak: 2, highest_streak: 3 },
          { rank: 5, name: "TableTurner", total_score: 750, current_streak: 2, highest_streak: 3 },
        ];
        setLeaderboardData(mockLeaderboardData);
        setUserProgress({
          completedCases: 2,
          totalCases: 5,
          percentage: 40,
          levels: [
            { level_id: 1, completed: true, score: 350, attempts: 2 },
            { level_id: 2, completed: true, score: 420, attempts: 3 },
            { level_id: 3, completed: false, score: 0, attempts: 1 }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
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
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  
  const renderHomePage = () => (
    <div className="flex flex-col gap-8">
      <div className="bg-gradient-to-r from-red-900 to-purple-900 rounded-xl p-8 shadow-lg text-white">
        <h2 className="text-3xl font-bold mb-4">Welcome Detective</h2>
        <p className="mb-6">Solve complex crimes using only your SQL skills and detective intuition.</p>
        <button 
          className="bg-white text-purple-900 font-bold py-2 px-6 rounded-full hover:bg-purple-100 transition-all duration-300 flex items-center"
          onClick={() => setActivePage('levels')}
        >
          Start Investigating <ChevronRight className="ml-2" size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-red-700">
          <h3 className="text-xl font-bold text-yellow-400 mb-2 flex items-center">
            <Trophy size={20} className="text-yellow-500 mr-2" /> Leaderboard
          </h3>
          <p className="text-gray-300 mb-4">Top 3 SQL detectives this week</p>
          <ul className="space-y-2">
            {leaderboardData.slice(0, 3).map((player) => (
              <li key={player.rank} className="flex justify-between items-center border-b border-gray-700 pb-2">
                <span className="flex items-center">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs ${
                    player.rank === 1 ? 'bg-yellow-400' : 
                    player.rank === 2 ? 'bg-gray-300' : 'bg-amber-600'
                  } text-white font-bold`}>{player.rank}</span>
                  {player.name}
                </span>
                <span className="font-semibold text-white">{player.total_score}</span>
              </li>
            ))}
          </ul>
          <button 
            className="text-sm text-yellow-400 mt-3 hover:text-yellow-300"
            onClick={() => setActivePage('leaderboard')}
          >
            View Full Leaderboard
          </button>
        </div>
        
        <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-red-700">
          <h3 className="text-xl font-bold text-green-400 mb-2 flex items-center">
            <Database size={20} className="text-blue-500 mr-2" /> Your Progress
          </h3>
          <p className="text-gray-300 mb-4">Continue where you left off</p>
          <div className="flex items-center mb-4">
            <div className="w-2/3 bg-gray-700 rounded-full h-2.5 mr-2">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: userProgress ? `${userProgress.percentage}%` : '0%' }}></div>
            </div>
            <span className="text-sm text-gray-300">{userProgress ? `${userProgress.completedCases}/${userProgress.totalCases} cases solved` : "0/5 cases solved"}</span>
          </div>
          <button 
            className="bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-300 text-sm font-medium"
            onClick={() => navigate("/level1")}
          >
            Continue Investigation
          </button>
        </div>
      </div>
    </div>
  );
  
  const renderLeaderboard = () => (
    <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-red-700">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center">
        <Trophy size={24} className="text-yellow-500 mr-2" /> Global Leaderboard
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent">
          <thead>
            <tr className="bg-red-900 bg-opacity-50 text-yellow-400">
              <th className="py-3 px-4 text-left">Rank</th>
              <th className="py-3 px-4 text-left">Detective</th>
              <th className="py-3 px-4 text-left">Score</th>
              <th className="py-3 px-4 text-left">Current Streak</th>
              <th className="py-3 px-4 text-left">Highest Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {leaderboardData.map((player) => (
              <tr key={player.rank} className="hover:bg-gray-800 hover:bg-opacity-50 text-white">
                <td className="py-3 px-4">
                  <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center mr-1 text-xs ${
                    player.rank === 1 ? 'bg-yellow-400 text-black' : 
                    player.rank === 2 ? 'bg-gray-300 text-black' : 
                    player.rank === 3 ? 'bg-amber-600 text-white' : 'bg-gray-700 text-white'
                  } font-bold`}>{player.rank}</span>
                </td>
                <td className="py-3 px-4 font-medium">{player.name}</td>
                <td className="py-3 px-4">{player.total_score}</td>
                <td className="py-3 px-4">{player.current_streak}</td>
                <td className="py-3 px-4">{player.highest_streak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  const renderLevels = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Case Files</h2>
      <div className="grid grid-cols-1 gap-4">
        {levels.map((level) => (
          <div 
            key={level.id}
            className={`bg-black bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 ${
              level.completed ? 'border-green-500' : 'border-red-500'
            } cursor-pointer transform hover:-translate-y-1 border border-red-700`}
            onClick={() => navigate(`/level${level.id}`)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{level.title}</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    level.difficulty === 'Easy' ? 'bg-green-900 text-green-200' :
                    level.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-red-900 text-red-200'
                  }`}>
                    {level.difficulty}
                  </span>
                  {level.completed && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-200">
                      Completed
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight size={20} className="text-red-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderContent = () => {
    if (activePage === 'home') return renderHomePage();
    if (activePage === 'leaderboard') return renderLeaderboard();
    if (activePage === 'levels') return renderLevels();
    return null;
  };
  
  return (
    <div className="min-h-screen text-white font-sans relative" style={{
      backgroundImage: "url('/home_background.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0">
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

      <div className="relative z-10">
        <nav className="bg-black bg-opacity-50 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center px-6 border-b border-red-700 sticky top-0 z-50">
          <div className="flex items-center">
            <span className="text-3xl mr-2 animate-pulse">🕵️</span>
            <h1 className="text-3xl font-bold tracking-wide">
              <span className="text-yellow-400">SQL</span>
              <span className="text-red-500">Murder</span>
              <span className="text-white">Mystery</span>
            </h1>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleNav}
              className="text-white focus:outline-none"
            >
              {isNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Desktop Navigation - Styled like Home component */}
          <div className="hidden md:flex space-x-6 items-center">
            <button 
              className={`nav-link relative overflow-hidden hover:text-yellow-400 transition duration-300 font-semibold ${activePage === 'home' ? 'text-yellow-400 font-bold' : 'text-white'}`}
              onClick={() => setActivePage('home')}
            >
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 hover-line"></span>
            </button>
            
            <button 
              className={`nav-link relative overflow-hidden hover:text-yellow-400 transition duration-300 font-semibold ${activePage === 'levels' ? 'text-yellow-400 font-bold' : 'text-white'}`}
              onClick={() => setActivePage('levels')}
            >
              <span>Cases</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 hover-line"></span>
            </button>
            
            <button 
              className={`nav-link relative overflow-hidden hover:text-yellow-400 transition duration-300 font-semibold ${activePage === 'leaderboard' ? 'text-yellow-400 font-bold' : 'text-white'}`}
              onClick={() => setActivePage('leaderboard')}
            >
              <span>Leaderboard</span>
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
            
            {/* User account dropdown */}
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

              {showDropdown && (
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
        
        {/* Mobile Navigation */}
        {isNavOpen && (
          <div className="md:hidden py-4 px-6 bg-black bg-opacity-90 backdrop-blur-md border-b border-red-700 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <button 
                className={`hover:bg-red-900 hover:bg-opacity-50 px-4 py-2 rounded ${activePage === 'home' ? 'bg-red-900 bg-opacity-50 text-yellow-400' : 'text-white'}`}
                onClick={() => {
                  setActivePage('home');
                  setIsNavOpen(false);
                }}
              >
                <Home size={16} className="inline mr-2" /> Home
              </button>
              <button 
                className={`hover:bg-red-900 hover:bg-opacity-50 px-4 py-2 rounded ${activePage === 'levels' ? 'bg-red-900 bg-opacity-50 text-yellow-400' : 'text-white'}`}
                onClick={() => {
                  setActivePage('levels');
                  setIsNavOpen(false);
                }}
              >
                <Database size={16} className="inline mr-2" /> Cases
              </button>
              <button 
                className={`hover:bg-red-900 hover:bg-opacity-50 px-4 py-2 rounded ${activePage === 'leaderboard' ? 'bg-red-900 bg-opacity-50 text-yellow-400' : 'text-white'}`}
                onClick={() => {
                  setActivePage('leaderboard');
                  setIsNavOpen(false);
                }}
              >
                <Trophy size={16} className="inline mr-2" /> Leaderboard
              </button>
              <button 
                className="hover:bg-red-900 hover:bg-opacity-50 px-4 py-2 rounded text-white"
                onClick={() => {
                  navigate("/faqs");
                  setIsNavOpen(false);
                }}
              >
                <FaQuestionCircle className="inline mr-2" /> FAQs
              </button>
              <div className="border-t border-red-800 pt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center mr-2">
                    <FaUserCircle />
                  </div>
                  {user.name}
                </div>
                <button 
                  className="bg-red-800 hover:bg-red-700 p-2 rounded-full"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          ) : (
            renderContent()
          )}
        </main>
        
        {/* Footer */}
        <footer className="bg-black bg-opacity-50 backdrop-blur-sm p-6 text-center border-t border-red-700 mt-12">
          <div className="container mx-auto px-4">
            <div className="border-t border-gray-700 mt-4 pt-4 text-sm text-gray-500 text-center">
              © 2025 SQL Murder Mystery Game. All detective rights reserved.
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
        
        .nav-link:hover .hover-line {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;