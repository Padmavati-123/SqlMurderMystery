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

  // Define case counts for each level
  const levelStructure = {
    level1: { totalCases: 32, name: "Level 1", color: "red" },
    level2: { totalCases: 32, name: "Level 2", color: "blue" },
    level3: { totalCases: 12, name: "Level 3", color: "purple" }
  };

  // Define the available levels
  const levels = [
    { id: 1, title: "LEVEL 1", difficulty: "Easy", completed: false },
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
            const userResponse = await fetch("https://sql-backend-hggtg3ccd8h8fpfv.southindia-01.azurewebsites.net/auth/user", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
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

        const leaderboardResponse = await fetch('sql-backend-hggtg3ccd8h8fpfv.southindia-01.azurewebsites.net/api/leaderboard', {
          method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
        });
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
          // Fetch user progress data for all levels
          const progressResponse = await fetch('sql-backend-hggtg3ccd8h8fpfv.southindia-01.azurewebsites.net/api/user/progress', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (progressResponse.ok) {
            const progressResult = await progressResponse.json();
            
            // Process the progress data with explicit Number conversion
            const progressData = {
              level1: {
                completedCases: Number(progressResult.progress?.level1?.completedCases || 0),
                totalCases: Number(levelStructure.level1.totalCases),
              },
              level2: {
                completedCases: Number(progressResult.progress?.level2?.completedCases || 0),
                totalCases: Number(levelStructure.level2.totalCases),
              },
              level3: {
                completedCases: Number(progressResult.progress?.level3?.completedCases || 0),
                totalCases: Number(levelStructure.level3.totalCases),
              }
            };
            
            // Calculate total progress
            const totalCompletedCases = 
            Number(progressData.level1.completedCases) + 
            Number(progressData.level2.completedCases) + 
            Number(progressData.level3.completedCases);
          
          const totalCases = 
            Number(progressData.level1.totalCases) + 
            Number(progressData.level2.totalCases) + 
            Number(progressData.level3.totalCases);
          
          const percentage = Math.round((totalCompletedCases / totalCases) * 100);

            setUserProgress({
              ...progressData,
              totalCompletedCases,
              totalCases,
              percentage
            });

            // Update levels completion status
            const updatedLevels = levels.map(level => {
      const levelKey = `level${level.id}`;
      const levelProgress = progressData[levelKey];
      return {
        ...level,
        completed: Number(levelProgress.completedCases) === Number(levelProgress.totalCases)
      };
    });
  }

          // Fetch user stats
          const statsResponse = await fetch('sql-backend-hggtg3ccd8h8fpfv.southindia-01.azurewebsites.net/api/user/stats', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (statsResponse.ok) {
            const statsResult = await statsResponse.json();
            setUserStats(statsResult.stats);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        
        // Fallback mock data if API fails
        const mockLeaderboardData = [
          { rank: 1, name: "SQLSherlock", total_score: 980, current_streak: 5, highest_streak: 5 },
          { rank: 2, name: "QueryDetective", total_score: 925, current_streak: 4, highest_streak: 4 },
          { rank: 3, name: "JoinMaster", total_score: 870, current_streak: 3, highest_streak: 4 },
          { rank: 4, name: "SelectSleuth", total_score: 810, current_streak: 2, highest_streak: 3 },
          { rank: 5, name: "TableTurner", total_score: 750, current_streak: 2, highest_streak: 3 },
        ];
        setLeaderboardData(mockLeaderboardData);
        
        // Mock progress data
        const mockProgressData = {
          level1: {
            completedCases: 2,
            totalCases: 32,
          },
          level2: {
            completedCases: 1,
            totalCases: 32,
          },
          level3: {
            completedCases: 0,
            totalCases: 12,
          }
        };
        
        const totalCompletedCases = 
          mockProgressData.level1.completedCases + 
          mockProgressData.level2.completedCases + 
          mockProgressData.level3.completedCases;
        
        const totalCases = 
          mockProgressData.level1.totalCases + 
          mockProgressData.level2.totalCases + 
          mockProgressData.level3.totalCases;
        
        setUserProgress({
          ...mockProgressData,
          totalCompletedCases,
          totalCases,
          percentage: (totalCompletedCases / totalCases) * 100
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
  
  // For the home page leaderboard (Top 3 detectives + User stats if not in top 3)
  const renderHomePage = () => {
    // Find user in leaderboard data or calculate their position
    const userInLeaderboard = leaderboardData.find(player => player.name === user.name);
    
    // Calculate user's rank and stats
    const userRank = userInLeaderboard ? userInLeaderboard.rank : leaderboardData.length + 1;
    const userScore = userInLeaderboard ? userInLeaderboard.total_score : (userStats ? userStats.total_score : 0);
    
    // Check if user is in top 3
    const isUserInTop3 = leaderboardData.slice(0, 3).some(player => player.name === user.name);

    return (
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
                <li key={player.rank} className={`flex justify-between items-center border-b border-gray-700 pb-2 ${player.name === user.name ? 'bg-yellow-600 bg-opacity-50 px-2 rounded' : ''}`}>
                  <span className="flex items-center">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs ${
                      player.rank === 1 ? 'bg-yellow-400 text-black' : 
                      player.rank === 2 ? 'bg-gray-300 text-black' : 'bg-amber-600 text-white'
                    } font-bold`}>{player.rank}</span>
                    {player.name} {player.name === user.name ? '(You)' : ''}
                  </span>
                  <span className="font-semibold text-white">{player.total_score}</span>
                </li>
              ))}
            </ul>
            
            {/* Show user stats if not in top 3 */}
            {!isUserInTop3 && (
              <div className="mt-3 border-t border-gray-700 pt-3">
                <div className="flex justify-between items-center bg-yellow-600 bg-opacity-50 p-2 rounded">
                  <span className="flex items-center">
                    <span className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-2 text-xs text-black font-bold">
                      {userRank}
                    </span>
                    <span className="text-white font-medium">{user.name} (You)</span>
                  </span>
                  <span className="font-semibold text-white">{userScore}</span>
                </div>
              </div>
            )}
            
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
            <p className="text-gray-300 mb-4">Your detective journey so far</p>
            
            {/* Overall progress bar */}
            <div className="flex items-center mb-4">
              <div className="w-2/3 bg-gray-700 rounded-full h-2.5 mr-2">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${userProgress?.percentage || 0}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-300">
                {userProgress?.totalCompletedCases || 0}/{userProgress?.totalCases || 76} cases solved
              </span>
            </div>
            
            {/* Level-specific progress */}
            <div className="space-y-3 mt-4">
              {/* Level 1 */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-red-800 rounded-full flex items-center justify-center mr-2 text-xs text-white font-bold">1</span>
                  <span className="text-gray-300">Level 1</span>
                </div>
                <span className="text-sm text-gray-300">
                  {userProgress?.level1?.completedCases || 0}/{userProgress?.level1?.totalCases || 32}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-red-600 h-1.5 rounded-full" 
                  style={{ width: `${((userProgress?.level1?.completedCases || 0) / (userProgress?.level1?.totalCases || 32)) * 100}%` }}
                ></div>
              </div>
            
              {/* Level 2 */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center mr-2 text-xs text-white font-bold">2</span>
                  <span className="text-gray-300">Level 2</span>
                </div>
                <span className="text-sm text-gray-300">
                  {userProgress?.level2?.completedCases || 0}/{userProgress?.level2?.totalCases || 32}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full" 
                  style={{ width: `${((userProgress?.level2?.completedCases || 0) / (userProgress?.level2?.totalCases || 32)) * 100}%` }}
                ></div>
              </div>
            
              {/* Level 3 */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-purple-800 rounded-full flex items-center justify-center mr-2 text-xs text-white font-bold">3</span>
                  <span className="text-gray-300">Level 3</span>
                </div>
                <span className="text-sm text-gray-300">
                  {userProgress?.level3?.completedCases || 0}/{userProgress?.level3?.totalCases || 12}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-purple-600 h-1.5 rounded-full" 
                  style={{ width: `${((userProgress?.level3?.completedCases || 0) / (userProgress?.level3?.totalCases || 12)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <button 
                className="bg-red-700 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-all duration-300 text-sm font-medium"
                onClick={() => navigate("/level1")}
              >
                Level 1
              </button>
              <button 
                className="bg-blue-700 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-all duration-300 text-sm font-medium"
                onClick={() => navigate("/level2")}
              >
                Level 2
              </button>
              <button 
                className="bg-purple-700 text-white py-2 px-3 rounded-lg hover:bg-purple-600 transition-all duration-300 text-sm font-medium"
                onClick={() => navigate("/level3")}
              >
                Level 3
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // For the global leaderboard page (User stats first, then full leaderboard)
  const renderLeaderboard = () => {
    // Find user's position in the leaderboard or create a user entry if not present
    const userInLeaderboard = leaderboardData.find(player => player.name === user.name);
    
    // Get user's stats - properly calculate them even if not in leaderboard
    const userRank = userInLeaderboard ? userInLeaderboard.rank : leaderboardData.length + 1;
    const userScore = userInLeaderboard ? userInLeaderboard.total_score : (userStats ? userStats.total_score : 0);
    const userCurrentStreak = userInLeaderboard ? userInLeaderboard.current_streak : (userStats ? userStats.current_streak : 0);
    const userHighestStreak = userInLeaderboard ? userInLeaderboard.highest_streak : (userStats ? userStats.highest_streak : 0);
    
    return (
      <div className="space-y-6">
        {/* User Stats Section - Always shown first */}
        <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-yellow-600">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">Your Stats</h3>
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
              <tbody>
                <tr className="bg-yellow-600 text-black font-medium">
                  <td className="py-3 px-4">
                    <span className="w-6 h-6 bg-yellow-400 text-black rounded-full inline-flex items-center justify-center font-bold">{userRank}</span>
                  </td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{userScore}</td>
                  <td className="py-3 px-4">{userCurrentStreak}</td>
                  <td className="py-3 px-4">{userHighestStreak}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Global Leaderboard Section */}
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
                {/* Full leaderboard with user highlighted */}
                {leaderboardData.map((player) => (
                  <tr
                    key={player.rank}
                    className={`hover:bg-gray-800 hover:bg-opacity-50 ${player.name === user.name ? 'bg-yellow-600 text-black' : 'text-white'}`}
                  >
                    <td className="py-3 px-4">
                      <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center mr-1 text-xs ${
                        player.rank === 1 ? 'bg-yellow-400 text-black' : 
                        player.rank === 2 ? 'bg-gray-300 text-black' : 
                        player.rank === 3 ? 'bg-amber-600 text-white' : 
                        'bg-gray-700 text-white'
                      } font-bold`}>{player.rank}</span>
                    </td>
                    <td className="py-3 px-4 font-medium">{player.name} {player.name === user.name ? '(You)' : ''}</td>
                    <td className="py-3 px-4">{player.total_score}</td>
                    <td className="py-3 px-4">{player.current_streak}</td>
                    <td className="py-3 px-4">{player.highest_streak}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  
  const renderLevels = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Case Files</h2>
      <div className="grid grid-cols-1 gap-4">
        {levels.map((level) => {
          // Calculate level completion status based on user progress
          const levelKey = `level${level.id}`;
          const levelProgress = userProgress?.[levelKey] || { completedCases: 0, totalCases: 32 };
          const isCompleted = levelProgress.completedCases === levelProgress.totalCases;
          const progress = (levelProgress.completedCases / levelProgress.totalCases) * 100;
          
          return (
            <div 
              key={level.id}
              className={`bg-black bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 ${
                isCompleted ? 'border-green-500' : 'border-red-500'
              } cursor-pointer transform hover:-translate-y-1 border border-red-700`}
              onClick={() => navigate(`/level${level.id}`)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{level.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      level.difficulty === 'Easy' ? 'bg-green-900 text-green-200' :
                      level.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                      'bg-red-900 text-red-200'
                    }`}>
                      {level.difficulty}
                    </span>
                    {isCompleted && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-200">
                        Completed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-700 rounded-full h-1.5 mr-2">
                      <div 
                        className={`h-1.5 rounded-full ${
                          level.id === 1 ? 'bg-red-600' :
                          level.id === 2 ? 'bg-blue-600' :
                          'bg-purple-600'
                        }`} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-300">
                      {levelProgress.completedCases}/{levelProgress.totalCases} cases
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-red-400" />
              </div>
            </div>
          )
        })}
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

                    {/* <button
                      className="w-full text-left py-2 px-3 rounded-md hover:bg-red-700 hover:bg-opacity-30 transition flex items-center"
                      onClick={() => navigate("/history")}
                    >
                      <span>Case History</span>
                      <FaArrowRight className="ml-auto text-xs opacity-50" />
                    </button> */}

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