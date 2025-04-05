import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080';

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

  if (authError) {
    return (
      <div className="text-center p-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          {authError}
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
          onClick={handleLoginRedirect}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading && !cases.length && viewMode === 'list') {
    return (
      <div className="text-center p-8">
        <div className="animate-pulse">Loading challenges...</div>
        <div className="text-sm text-gray-500 mt-2">
          If this takes too long, check if your backend server is running at {API_BASE_URL}
        </div>
      </div>
    );
  }

  if (error && !cases.length && viewMode === 'list') {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-sm mb-4">
          Make sure your backend server is running at {API_BASE_URL}<br />
          And that CORS is properly configured to allow requests from this client.
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            const token = localStorage.getItem("token");
            if (token) fetchAllCases(token);
            else setAuthError("Please login to continue");
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">SQL Mystery - Level 1</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((caseItem) => (
            <div
              key={caseItem.case_id}
              className={`bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow ${completedCases.includes(Number(caseItem.case_id)) ? 'border-l-4 border-green-500' : ''
                }`}
              onClick={() => fetchCaseDetails(caseItem.case_id)}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold mb-2">Case #{caseItem.case_id}</h3>
                {completedCases.includes(Number(caseItem.case_id)) && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Solved
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">Type: {caseItem.type}</p>
              <p className="text-sm text-gray-600 mb-2">Date: {caseItem.date}</p>
              <p className="text-sm text-gray-600 mb-2">City: {caseItem.city}</p>
              <p className="text-sm text-gray-800 line-clamp-2">{caseItem.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <button
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        onClick={handleBackToList}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to all cases
      </button>

      {loading ? (
        <div className="text-center p-8">
          <div className="animate-pulse">Loading case details...</div>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {question && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Case #{question.case_id}</h2>
                {completedCases.includes(Number(question.case_id)) && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Solved
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Date: <span className="font-medium">{question.date}</span></p>
                  <p className="text-sm text-gray-600">Type: <span className="font-medium">{question.type}</span></p>
                  <p className="text-sm text-gray-600">City: <span className="font-medium">{question.city}</span></p>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-md font-semibold mb-2">Description:</h3>
                <p className="text-md">{question.description}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-md">
                <h3 className="text-md font-semibold mb-2">Your Task:</h3>
                <p>Write a SQL query to find the person_ids involved in this crime.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">SQL Query Editor</h3>
              <div className="mb-4">
                <textarea
                  className="w-full h-48 p-4 border border-gray-300 rounded font-mono text-sm resize-none"
                  placeholder="SELECT * FROM ..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={handleQueryKeyDown}
                ></textarea>
                <p className="text-xs text-gray-500 mt-2">Press Ctrl+Enter to run your query</p>
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                onClick={executeQuery}
                disabled={loading}
              >
                {loading ? 'Running...' : 'Run Query'}
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Results & Submit Answer</h3>
              {queryResults ? (
                <div className="mb-4 max-h-64 overflow-auto">
                  {queryResults.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(queryResults[0]).map((key) => (
                            <th
                              key={key}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {queryResults.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {Object.values(row).map((value, colIndex) => (
                              <td
                                key={colIndex}
                                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                              >
                                {value === null ? 'NULL' : value.toString()}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500">Query executed successfully but returned no results.</p>
                  )}
                </div>
              ) : (
                <div className="mb-4 p-6 bg-gray-50 rounded text-center text-gray-500">
                  No query results yet. Run a SQL query to see results.
                </div>
              )}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Answer (comma-separated person IDs)
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="e.g. 12345, 67890"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={handleAnswerKeyDown}
                />
                <p className="text-xs text-gray-500 mt-1">Press Enter to submit</p>

                <button
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300 w-full"
                  onClick={submitAnswer}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Answer'}
                </button>

                {feedback && (
                  <div className={`mt-4 p-4 rounded ${feedback.correct ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {feedback.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Level2Game;