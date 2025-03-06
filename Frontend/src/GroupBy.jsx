import React from "react";
import { useNavigate } from "react-router-dom";

const GroupByExplanation = () => {
    const navigate = useNavigate();

    // Function to navigate to the MCQ test page for topic ID 16
    const handleTakeTest = () => {
        navigate(`/quiz/16`); // Redirects to test page for topic 16
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h1 className="text-2xl font-bold mb-4">GROUP BY in SQL</h1>

            <p className="mb-4">
                The <code>GROUP BY</code> clause in SQL is used to group rows with the same values in specified columns
                and apply aggregate functions like <code>COUNT</code>, <code>SUM</code>, <code>AVG</code>, <code>MAX</code>, and <code>MIN</code> to each group.
            </p>

            <h2 className="text-xl font-semibold mt-4">Important Points & Examples</h2>

            <ul className="list-disc ml-6">
                <li className="mb-2">
                    <strong>Used with Aggregate Functions:</strong>
                    <pre className="bg-gray-200 p-2 rounded">SELECT department, COUNT(*) FROM employees GROUP BY department;</pre>
                    This counts employees in each department.
                </li>

                <li className="mb-2">
                    <strong>Columns in SELECT Must Be in GROUP BY or Aggregated:</strong>
                    <pre className="bg-gray-200 p-2 rounded">SELECT department, AVG(salary) FROM employees GROUP BY department;</pre>
                    Every column in SELECT must be either inside an aggregate function or in GROUP BY.
                </li>

                <li className="mb-2">
                    <strong>Filtering Before and After GROUP BY:</strong> Use <code>WHERE</code> before grouping, and <code>HAVING</code> after aggregation.
                    <pre className="bg-gray-200 p-2 rounded">
                        SELECT department, AVG(salary) FROM employees WHERE salary &gt; 30000
                        GROUP BY department HAVING AVG(salary) &gt; 50000;
                    </pre>

                </li>

                <li className="mb-2">
                    <strong>Multiple Columns in GROUP BY:</strong>
                    <pre className="bg-gray-200 p-2 rounded">SELECT department, job_title, COUNT(*) FROM employees GROUP BY department, job_title;</pre>
                    Groups employees by both department and job title.
                </li>

                <li className="mb-2">
                    <strong>NULL Values in GROUP BY:</strong> NULL values are treated as a separate group.
                    <pre className="bg-gray-200 p-2 rounded">SELECT manager_id, COUNT(*) FROM employees GROUP BY manager_id;</pre>
                </li>
            </ul>

            {/* Take Test Button */}
            <button
                onClick={handleTakeTest}
                className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
                Take Test
            </button>
        </div>
    );
};

export default GroupByExplanation;
