import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://sql-backend-hggtg3ccd8h8fpfv.southindia-01.azurewebsites.net';

const Level2Game = () => {
  const [cases, setCases] = useState([]);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [caseId, setCaseId] = useState(null);
  const [completedCases, setCompletedCases] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthError("Please login to track your progress and access the game");
      setLoading(false);
      return;
    }
    fetchAllCases(token);
    fetchCompletedCases(token);
  }, []);

  const fetchAllCases = async (token) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/api/level2/all-cases`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.data && response.data.success && Array.isArray(response.data.cases)) {
        setCases(response.data.cases);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError('Unexpected response format from server');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching cases:', err);

      if (err.response?.status === 401) {
        setAuthError('Your session has expired. Please login again.');
        localStorage.removeItem("token");
      } else {
        setError(
          err.response?.data?.message ||
          'Failed to load cases. Please ensure the backend server is running.'
        );
      }

      setLoading(false);
    }
  };

  const fetchCompletedCases = async (token) => {
    try {
      if (!token) {
        console.log("No auth token found, skipping completed cases fetch");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/user/completed-cases-2`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      console.log('Raw completed cases response:', response.data);

      if (response.data && response.data.success && Array.isArray(response.data.completedCases)) {
        const validCases = response.data.completedCases
          .map(id => Number(id))
          .filter(id => !isNaN(id));

        console.log('Processed completed cases:', validCases);
        setCompletedCases(validCases);
      } else {
        console.warn('Unexpected response format:', response.data);
        setCompletedCases([]);
      }
    } catch (err) {
      console.error('Error fetching completed cases:', err);

      if (err.response?.status === 401) {
        setAuthError('Your session has expired. Please login again.');
        localStorage.removeItem("token");
      }

      setCompletedCases([]);
    }
  };

  const fetchCaseDetails = async (caseId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthError("Please login to access case details");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/api/level2/case/${caseId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.data && response.data.success) {
        setQuestion(response.data.question);
        setCaseId(response.data.case_id);
        setViewMode('detail');
      } else {
        setError('Failed to load case details. Unexpected response format.');
      }

      setLoading(false);
      setQueryResults(null);
      setUserQuery('');
      setAnswer('');
      setFeedback(null);
    } catch (err) {
      console.error('Error fetching case details:', err);

      if (err.response?.status === 401) {
        setAuthError('Your session has expired. Please login again.');
        localStorage.removeItem("token"); 
      } else {
        setError(
          err.response?.data?.message ||
          'Failed to load case details. Please ensure the backend server is running.'
        );
      }

      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    const token = localStorage.getItem("token");
    if (token) {
      fetchAllCases(token);
      fetchCompletedCases(token);
    } else {
      setAuthError("Please login to view cases");
    }
  };

  const executeQuery = async () => {
    if (!userQuery.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setAuthError("Please login to execute queries");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_BASE_URL}/api/execute-query-2`,
        { query: userQuery },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.success) {
        setQueryResults(response.data.results);
      } else {
        setError('Error executing query: Unexpected response format');
        setQueryResults(null);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error executing query:', err);

      if (err.response?.status === 401) {
        setAuthError('Your session has expired. Please login again.');
        localStorage.removeItem("token");
      } else {
        setError(err.response?.data?.message || 'Error executing query');
      }

      setQueryResults(null);
      setLoading(false);
    }
  };


  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError('Please enter valid person IDs');
      return;
    }
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthError('Please login to submit answers');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!caseId) {
        setError('Case ID is missing. Try refreshing the page.');
        setLoading(false);
        return;
      }

      const numericCaseId = Number(caseId);
      if (isNaN(numericCaseId)) {
        setError('Invalid Case ID format');
        setLoading(false);
        return;
      }

      const payload = { answer: answer.trim(), caseId: numericCaseId };

      console.log('Submitting Answer:', payload);

      const response = await axios.post(`${API_BASE_URL}/api/check-answer-2`, payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      console.log('Response:', response.data);

      if (response.data && response.data.success) {
        setFeedback({
          message: response.data.message,
          correct: response.data.correct
        });

        if (response.data.correct) {
          const caseIdNumber = Number(caseId);
          setCompletedCases(prev => {
            if (!prev.includes(caseIdNumber)) {
              return [...prev, caseIdNumber];
            }
            return prev;
          });

          setTimeout(() => {
            fetchCompletedCases(token);
          }, 1000); 

          setTimeout(() => {
            handleBackToList();
          }, 3000);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error checking answer:', err);

      if (err.response?.status === 401) {
        setAuthError('Your session has expired. Please login again.');
        localStorage.removeItem("token"); 
      } else {
        setError(err.response?.data?.message || 'Error checking answer');
      }

      setLoading(false);
    }
  };

  const handleQueryKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeQuery();
    }
  };

  const handleAnswerKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitAnswer();
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { returnTo: '/game/level1' } });
  };

  // Dark theme spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-800 border-l-4 border-yellow-500 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-2">Authentication Required</h2>
            <p className="mb-4">{authError}</p>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md shadow transition-colors duration-300"
              onClick={handleLoginRedirect}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !cases.length && viewMode === 'list') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-8">
        <LoadingSpinner />
        <p className="mt-4 text-lg">Loading challenges...</p>
      </div>
    );
  }

  if (error && !cases.length && viewMode === 'list') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-8">
        <div className="max-w-lg w-full bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="text-red-400 mb-6 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <p className="text-xl font-bold">{error}</p>
          </div>

          <p className="text-sm text-gray-400 mb-6 text-center">
            Make sure your backend server is running at {API_BASE_URL}<br />
            And that CORS is properly configured to allow requests from this client.
          </p>

          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md shadow transition-colors duration-300"
            onClick={() => {
              const token = localStorage.getItem("token");
              if (token) fetchAllCases(token);
              else setAuthError("Please login to continue");
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">SQL Mystery - Level 2</h1>
            <p className="text-purple-400">Find the perpetrators behind these mysterious crimes!</p>
          </header>

          {error && (
            <div className="bg-red-900 border-l-4 border-red-500 text-red-200 p-4 rounded-md mb-6">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                {error}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((caseItem) => (
              <div
                key={caseItem.case_id}
                className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-purple-500/20 hover:translate-y-[-2px] transition-all duration-300 cursor-pointer
                  ${completedCases.includes(Number(caseItem.case_id)) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'}`}
                onClick={() => fetchCaseDetails(caseItem.case_id)}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">Case #{caseItem.case_id}</h3>
                    {completedCases.includes(Number(caseItem.case_id)) && (
                      <span className="bg-green-900 text-green-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Solved
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span className="text-sm">{caseItem.date}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="text-sm">{caseItem.city}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="inline-block bg-gray-700 text-purple-300 text-xs px-2 py-1 rounded-full mb-3">
                      {caseItem.type}
                    </span>
                    <p className="text-gray-300 line-clamp-3">{caseItem.description}</p>
                  </div>
                  
                  <div className="pt-2">
                    <button className="text-purple-400 text-sm hover:text-purple-300 flex items-center">
                      <span>View case details</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <button
          className="mb-6 flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200"
          onClick={handleBackToList}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to all cases
        </button>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {error && (
              <div className="bg-red-900 border-l-4 border-red-500 text-red-200 p-4 rounded-md mb-6">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {question && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border-l-4 border-purple-500">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Case #{question.case_id}</h2>
                    <div className="flex items-center">
                      <span className="text-purple-400 text-sm">{question.type}</span>
                      <span className="mx-2 text-gray-500">•</span>
                      <span className="text-gray-400 text-sm">{question.date}</span>
                      <span className="mx-2 text-gray-500">•</span>
                      <span className="text-gray-400 text-sm">{question.city}</span>
                    </div>
                  </div>
                  
                  {completedCases.includes(Number(question.case_id)) && (
                    <span className="bg-green-900 text-green-300 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      Solved
                    </span>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Case File:</h3>
                  <p className="text-gray-300 leading-relaxed">{question.description}</p>
                </div>
                
                <div className="bg-gray-900 p-4 rounded-md border-l-4 border-yellow-500">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Your Task:</h3>
                  <p className="text-gray-300">Write a SQL query to find the <span className="text-yellow-400 font-semibold">person_ids</span> involved in this crime.</p>
                </div>
              </div>
            )}

<div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Schema Diagram
              </h3>
              <div className="bg-gray-900 p-4 rounded-lg overflow-auto">
                <img
                  src="/schemaDiagram.jpeg"
                  alt="Database Schema"
                  className="w-200 h-100 mx-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/600/500";
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="border-b border-gray-700 px-6 py-4 bg-gray-750">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                    SQL Query Editor
                  </h3>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <textarea
                      className="w-full h-56 p-4 rounded-md bg-gray-900 border border-gray-700 text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="SELECT * FROM ..."
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      onKeyDown={handleQueryKeyDown}
                    ></textarea>
                    <p className="text-xs text-gray-400 mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      Press Ctrl+Enter to run your query
                    </p>
                  </div>
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md shadow-md transition-colors duration-300 disabled:bg-gray-700 disabled:text-gray-500 w-full flex justify-center items-center space-x-2"
                    onClick={executeQuery}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Running Query...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        <span>Run Query</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="border-b border-gray-700 px-6 py-4 bg-gray-750">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Results & Submit Answer
                  </h3>
                </div>
                <div className="p-6">
                  {queryResults ? (
                    <div className="mb-6 max-h-64 overflow-auto rounded-md border border-gray-700">
                      {queryResults.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead className="bg-gray-900">
                            <tr>
                              {Object.keys(queryResults[0]).map((key) => (
                                <th
                                  key={key}
                                  className="px-4 py-3 text-left text-xs font-medium text-purple-400 uppercase tracking-wider"
                                >
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-gray-900 divide-y divide-gray-800">
                            {queryResults.map((row, rowIndex) => (
                              <tr key={rowIndex} className="hover:bg-gray-800">
                                {Object.values(row).map((value, colIndex) => (
                                  <td
                                    key={colIndex}
                                    className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-300"
                                  >
                                    {value === null ? <span className="text-gray-500">NULL</span> : value.toString()}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="p-4 text-center text-gray-400">
                          Query executed successfully but returned no results.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mb-6 p-6 bg-gray-900 rounded-md text-center text-gray-500 border border-gray-700">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <p>No query results yet. Run a SQL query to see results.</p>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-purple-400 mb-2">
                      Enter Answer (comma-separated person IDs)
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g. 12345, 67890"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyDown={handleAnswerKeyDown}
                    />
                    <p className="text-xs text-gray-400 mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Press Enter to submit
                    </p>

                    <button
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md shadow-md transition-colors duration-300 disabled:bg-gray-700 disabled:text-gray-500 w-full flex justify-center items-center space-x-2"
                      onClick={submitAnswer}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Submit Answer</span>
                        </>
                      )}
                    </button>

                    {feedback && (
                      <div 
                        className={`mt-4 p-4 rounded-md ${
                          feedback.correct 
                            ? 'bg-green-900/50 text-green-300 border border-green-700' 
                            : 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
                        }`}
                      >
                        <div className="flex items-start">
                          {feedback.correct ? (
                            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          )}
                          <span>{feedback.message}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Level2Game;