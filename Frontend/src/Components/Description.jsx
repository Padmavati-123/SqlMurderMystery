import { useParams, useNavigate } from "react-router-dom";
import React from "react";

const descriptions = {
    16: {
        title: "GROUP BY in SQL",
        content: "The GROUP BY clause in SQL is used to group rows with the same values in specified columns and apply aggregate functions like COUNT, SUM, AVG, MAX, and MIN.",
        points: [
            {
                heading: "Used with Aggregate Functions",
                code: "SELECT department, COUNT(*) FROM employees GROUP BY department;",
                description: "This counts employees in each department."
            },
            {
                heading: "Columns in SELECT Must Be in GROUP BY or Aggregated",
                code: "SELECT department, AVG(salary) FROM employees GROUP BY department;",
                description: "Every column in SELECT must be either inside an aggregate function or in GROUP BY."
            },
            {
                heading: "Filtering Before and After GROUP BY",
                code: "SELECT department, AVG(salary) FROM employees WHERE salary > 30000 GROUP BY department HAVING AVG(salary) > 50000;",
                description: "Use WHERE before grouping and HAVING after aggregation."
            },
            {
                heading: "Multiple Columns in GROUP BY",
                code: "SELECT department, job_title, COUNT(*) FROM employees GROUP BY department, job_title;",
                description: "This groups employees by both department and job title."
            },
            {
                heading: "NULL Values in GROUP BY",
                code: "SELECT manager_id, COUNT(*) FROM employees GROUP BY manager_id;",
                description: "NULL values are treated as a separate group."
            }
        ]
    },
    17: {
        title: "HAVING in SQL",
        content: "The HAVING clause is used in SQL to filter the results of a GROUP BY operation based on aggregate function conditions. Unlike WHERE, which filters individual rows before aggregation, HAVING filters groups after aggregation.",
        points: [
            {
                heading: "Used with GROUP BY",
                code: "SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 5;",
                description: "HAVING works in conjunction with GROUP BY to filter grouped records."
            },
            {
                heading: "Filters on Aggregate Functions",
                code: "SELECT category, AVG(price) FROM products GROUP BY category HAVING AVG(price) > 100;",
                description: "HAVING allows conditions on aggregate functions like COUNT, SUM, AVG, etc."
            },
            {
                heading: "HAVING vs WHERE",
                code: "SELECT department, SUM(salary) FROM employees WHERE salary > 50000 GROUP BY department HAVING SUM(salary) > 200000;",
                description: "WHERE filters before aggregation, while HAVING filters after aggregation."
            },
            {
                heading: "Can use multiple conditions",
                code: "SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 5 AND SUM(salary) > 500000;",
                description: "HAVING supports multiple conditions using AND/OR."
            }
        ]
    },
    11: {
        title: "IS NULL in SQL",
        content: "The IS NULL condition is used in SQL to check if a column contains NULL values. NULL represents missing or unknown data.",
        points: [
            {
                heading: "Check for NULL values:",
                code: "SELECT * FROM employees WHERE manager_id IS NULL;",
                description: "Filters rows where a column is NULL."
            },
            {
                heading: "Use IS NOT NULL to find non-null values:",
                code: "SELECT * FROM employees WHERE manager_id IS NOT NULL;",
                description: "Excludes NULL records."
            },
            {
                heading: "NULL does not equal anything:",
                code: "SELECT * FROM students WHERE grade IS NULL;",
                description: "Use IS NULL instead of = NULL."
            },
            {
                heading: "Use with COUNT to count NULLs:",
                code: "SELECT COUNT(*) FROM orders WHERE shipped_date IS NULL;",
                description: "COUNT(column) ignores NULLs, so COUNT(*) is used."
            }
        ]
    },
    8: {
        title: "BETWEEN in SQL",
        content: "The BETWEEN operator filters values within a specific range, including both the lower and upper bounds.",
        points: [
            {
                heading: "Numeric Range:",
                code: "SELECT * FROM products WHERE price BETWEEN 100 AND 500;",
                description: "Filters numbers within a range."
            },
            {
                heading: "Date Range:",
                code: "SELECT * FROM orders WHERE order_date BETWEEN '2023-01-01' AND '2023-06-30';",
                description: "Filters records within a date interval."
            },
            {
                heading: "Text Range:",
                code: "SELECT * FROM students WHERE name BETWEEN 'A' AND 'M';",
                description: "Filters alphabetically ordered text."
            }
        ]
    },
    15: {
        title: "MIN/MAX in SQL",
        content: "The MIN() and MAX() functions return the smallest and largest values in a column, respectively.",
        points: [
            {
                heading: "Find the lowest value:",
                code: "SELECT MIN(salary) FROM employees;",
                description: "MIN() retrieves the smallest number."
            },
            {
                heading: "Find the highest value:",
                code: "SELECT MAX(salary) FROM employees;",
                description: "MAX() retrieves the largest number."
            },
            {
                heading: "Use with GROUP BY:",
                code: "SELECT department, MAX(salary) FROM employees GROUP BY department;",
                description: "Gets the min/max per group."
            }
        ]
    },
    23: {
        title: "DELETE FROM in SQL",
        content: "The DELETE FROM statement removes records from a table. Using WHERE prevents deleting all data.",
        points: [
            {
                heading: "Delete specific rows:",
                code: "DELETE FROM employees WHERE department = 'HR';",
                description: "Removes only matching records."
            },
            {
                heading: "Delete all rows:",
                code: "DELETE FROM employees;",
                description: "Removes every record from a table."
            },
            {
                heading: "Delete using JOIN:",
                code: "DELETE e FROM employees e JOIN departments d ON e.dept_id = d.id WHERE d.name = 'Sales';",
                description: "Deletes data based on another table."
            }
        ]
    },
    20: {
        title: "RIGHT JOIN in SQL",
        content: "The RIGHT JOIN returns all records from the right table and matching records from the left table. Unmatched left table records appear as NULL.",
        points: [
            {
                heading: "Retrieves all right table records:",
                code: "SELECT * FROM employees RIGHT JOIN departments ON employees.dept_id = departments.id;",
                description: "Even if there is no match in the left table."
            },
            {
                heading: "Useful when the right table is primary:",
                code: "SELECT d.name, e.name FROM employees e RIGHT JOIN departments d ON e.dept_id = d.id;",
                description: "Ensures all right table data is retained."
            },
            {
                heading: "Can be rewritten using LEFT JOIN:",
                code: "SELECT d.name, e.name FROM departments d LEFT JOIN employees e ON e.dept_id = d.id;",
                description: "Swapping table order achieves the same result."
            }
        ]
    },
};

const DescriptionPage = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const topic = descriptions[Number(topicId)];

    if (!topic) {
        return <div className="p-6 text-center text-red-500">Topic not found!</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">{topic.title}</h1>
            <p className="text-gray-700 mb-6 leading-relaxed text-justify">{topic.content}</p>

            <ul className="list-disc list-outside text-gray-800 space-y-6">
                {topic.points.map((point, index) => (
                    <li key={index} className="ml-5">
                        <span className="font-semibold text-lg">{point.heading}</span>
                        <div className="overflow-auto bg-gray-100 text-gray-800 p-3 rounded-md mt-2 border border-gray-300">
                            <pre className="whitespace-pre-wrap break-words text-sm">{point.code}</pre>
                        </div>
                        <p className="text-gray-600 mt-2 text-justify">{point.description}</p>
                    </li>
                ))}
            </ul>

            <div className="flex justify-center mt-6">
                <button
                    onClick={() => navigate(`/quiz/${topicId}`)}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 shadow-md"
                >
                    Take Test
                </button>
            </div>
        </div>
    );
};

export default DescriptionPage;
