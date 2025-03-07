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
    6: {
        "title": "DISTINCT in SQL",
        "content": "The DISTINCT keyword in SQL is used to retrieve unique values from a column, ensuring that duplicate entries are removed from the result set.",
        "points": [
            {
                "heading": "Removing Duplicates from a Column",
                "code": "SELECT DISTINCT department FROM employees;",
                "description": "This retrieves unique department names from the employees table."
            },
            {
                "heading": "Using DISTINCT on Multiple Columns",
                "code": "SELECT DISTINCT department, job_title FROM employees;",
                "description": "This returns unique combinations of department and job title."
            },
            {
                "heading": "Using DISTINCT with Aggregate Functions",
                "code": "SELECT COUNT(DISTINCT department) FROM employees;",
                "description": "This counts the number of unique departments."
            },
            {
                "heading": "DISTINCT and NULL Values",
                "code": "SELECT DISTINCT manager_id FROM employees;",
                "description": "NULL values are considered unique, meaning one NULL will appear in the result."
            },
            {
                "heading": "DISTINCT with ORDER BY",
                "code": "SELECT DISTINCT department FROM employees ORDER BY department ASC;",
                "description": "This ensures the unique values are sorted in ascending order."
            }
        ]
    },

    5: {
        "title": "LIMIT / OFFSET in SQL",
        "content": "The LIMIT and OFFSET clauses in SQL are used to control the number of rows returned in a query, commonly for pagination and efficient data retrieval.",
        "points": [
            {
                "heading": "Using LIMIT to Restrict the Number of Rows",
                "code": "SELECT * FROM employees LIMIT 5;",
                "description": "Retrieves only the first 5 rows from the employees table."
            },
            {
                "heading": "Using OFFSET to Skip Rows",
                "code": "SELECT * FROM employees LIMIT 5 OFFSET 10;",
                "description": "Skips the first 10 rows and then retrieves the next 5 rows."
            },
            {
                "heading": "Pagination using LIMIT and OFFSET",
                "code": "SELECT * FROM employees ORDER BY employee_id LIMIT 10 OFFSET 20;",
                "description": "Fetches 10 rows, starting from the 21st record (skipping the first 20 rows)."
            },
            {
                "heading": "Using LIMIT with WHERE Clause",
                "code": "SELECT * FROM orders WHERE status = 'Shipped' LIMIT 10;",
                "description": "Fetches up to 10 shipped orders from the table."
            },
            {
                "heading": "Using LIMIT with DISTINCT",
                "code": "SELECT DISTINCT department FROM employees LIMIT 5;",
                "description": "Retrieves the first 5 unique department names."
            },
            {
                "heading": "Alternative: Using FETCH Instead of LIMIT (SQL Standard)",
                "code": "SELECT * FROM employees ORDER BY employee_id FETCH FIRST 10 ROWS ONLY;",
                "description": "Works similarly to LIMIT 10, used in databases like Oracle and SQL Server."
            }
        ]
    },

    9: {
        "title": "IN in SQL",
        "content": "The IN operator in SQL is used to filter records based on a list of specified values, making it a shorthand for multiple OR conditions.",
        "points": [
            {
                "heading": "Basic Usage",
                "code": "SELECT * FROM employees WHERE department IN ('HR', 'IT', 'Finance');",
                "description": "Filters employees belonging to the HR, IT, or Finance department."
            },
            {
                "heading": "Alternative to Multiple OR Conditions",
                "code": "SELECT * FROM products WHERE category = 'Electronics' OR category = 'Clothing' OR category = 'Books';",
                "description": "Can be rewritten as: SELECT * FROM products WHERE category IN ('Electronics', 'Clothing', 'Books');"
            },
            {
                "heading": "Using IN with Numeric Values",
                "code": "SELECT * FROM orders WHERE order_id IN (101, 102, 103);",
                "description": "Filters orders where the order ID is 101, 102, or 103."
            },
            {
                "heading": "Using NOT IN",
                "code": "SELECT * FROM students WHERE grade NOT IN ('A', 'B');",
                "description": "Selects students whose grades are neither A nor B."
            },
            {
                "heading": "Using IN with Subqueries",
                "code": "SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE total > 1000);",
                "description": "Selects customers who have placed orders with a total greater than 1000."
            },
            {
                "heading": "NULL Considerations with IN",
                "code": "SELECT * FROM employees WHERE manager_id IN (NULL, 101, 102);",
                "description": "If NULL is in the list, comparisons may not work as expected. Use IS NULL separately."
            }
        ]
    },

    10: {
        "title": "LIKE in SQL",
        "content": "The LIKE operator in SQL is used for pattern matching in text values, allowing the use of wildcard characters.",
        "points": [
            {
                "heading": "Basic Usage",
                "code": "SELECT * FROM employees WHERE name LIKE 'J%';",
                "description": "Finds all employees whose names start with 'J'."
            },
            {
                "heading": "Using % Wildcard",
                "code": "SELECT * FROM products WHERE name LIKE '%phone%';",
                "description": "Finds all products that contain 'phone' anywhere in their name."
            },
            {
                "heading": "Using _ Wildcard",
                "code": "SELECT * FROM students WHERE student_id LIKE 'A_2';",
                "description": "Finds student IDs that start with 'A', have any one character, followed by '2' (e.g., A12, AB2)."
            },
            {
                "heading": "Combining % and _",
                "code": "SELECT * FROM books WHERE title LIKE 'C%_r';",
                "description": "Finds titles starting with 'C', followed by any number of characters, ending with 'r'."
            },
            {
                "heading": "Using NOT LIKE",
                "code": "SELECT * FROM users WHERE email NOT LIKE '%@gmail.com';",
                "description": "Finds users whose email addresses are not from Gmail."
            },
            {
                "heading": "Case Sensitivity",
                "code": "SELECT * FROM customers WHERE name LIKE 'john%';",
                "description": "In most databases, LIKE is case-sensitive. Use ILIKE in PostgreSQL for case-insensitive search."
            }
        ]
    },

    13: {
        "title": "SUM in SQL",
        "content": "The SUM function in SQL is an aggregate function used to calculate the total sum of a numeric column.",
        "points": [
            {
                "heading": "Basic Usage",
                "code": "SELECT SUM(salary) FROM employees;",
                "description": "Calculates the total sum of all salaries in the employees table."
            },
            {
                "heading": "SUM with GROUP BY",
                "code": "SELECT department, SUM(salary) FROM employees GROUP BY department;",
                "description": "Calculates the total salary for each department."
            },
            {
                "heading": "SUM with WHERE Condition",
                "code": "SELECT SUM(salary) FROM employees WHERE department = 'IT';",
                "description": "Finds the total salary for employees in the IT department."
            },
            {
                "heading": "SUM with DISTINCT",
                "code": "SELECT SUM(DISTINCT salary) FROM employees;",
                "description": "Sums only distinct salary values, avoiding duplicate amounts."
            },
            {
                "heading": "SUM with HAVING",
                "code": "SELECT department, SUM(salary) FROM employees GROUP BY department HAVING SUM(salary) > 50000;",
                "description": "Filters departments where the total salary is greater than 50,000."
            },
            {
                "heading": "SUM with JOIN",
                "code": "SELECT c.customer_id, SUM(o.amount) FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id;",
                "description": "Finds the total amount spent by each customer using a JOIN."
            }
        ]
    },

    19: {
        "title": "LEFT JOIN in SQL",
        "content": "The LEFT JOIN in SQL is used to retrieve all records from the left table and matching records from the right table. If no match is found, NULL values are returned for columns from the right table.",
        "points": [
            {
                "heading": "Basic LEFT JOIN",
                "code": "SELECT employees.name, departments.department_name FROM employees LEFT JOIN departments ON employees.department_id = departments.id;",
                "description": "Retrieves all employees and their department names. If an employee is not assigned to a department, the department_name will be NULL."
            },
            {
                "heading": "LEFT JOIN with WHERE Condition",
                "code": "SELECT employees.name, departments.department_name FROM employees LEFT JOIN departments ON employees.department_id = departments.id WHERE departments.department_name IS NULL;",
                "description": "Finds employees who are not assigned to any department."
            },
            {
                "heading": "LEFT JOIN with Multiple Tables",
                "code": "SELECT customers.name, orders.order_id, payments.amount FROM customers LEFT JOIN orders ON customers.id = orders.customer_id LEFT JOIN payments ON orders.id = payments.order_id;",
                "description": "Joins three tables to show customers, their orders, and payments, ensuring all customers are listed even if they haven't placed orders."
            },
            {
                "heading": "LEFT JOIN with Aggregation",
                "code": "SELECT departments.department_name, COUNT(employees.id) AS employee_count FROM departments LEFT JOIN employees ON departments.id = employees.department_id GROUP BY departments.department_name;",
                "description": "Counts the number of employees in each department, including departments with no employees."
            },
            {
                "heading": "LEFT JOIN with ORDER BY",
                "code": "SELECT customers.name, orders.order_id FROM customers LEFT JOIN orders ON customers.id = orders.customer_id ORDER BY customers.name;",
                "description": "Lists all customers and their orders, ordered alphabetically by customer name."
            },
            {
                "heading": "LEFT JOIN with DISTINCT",
                "code": "SELECT DISTINCT employees.name, departments.department_name FROM employees LEFT JOIN departments ON employees.department_id = departments.id;",
                "description": "Retrieves unique employee names and their respective departments."
            }
        ]
    },

    22: {
        "title": "UPDATE in SQL",
        "content": "The UPDATE statement in SQL is used to modify existing records in a table. It allows changing one or multiple columns based on a specified condition.",
        "points": [
            {
                "heading": "Basic UPDATE Statement",
                "code": "UPDATE employees SET salary = 50000 WHERE id = 1;",
                "description": "Updates the salary of the employee with id 1 to 50,000."
            },
            {
                "heading": "Updating Multiple Columns",
                "code": "UPDATE employees SET salary = 60000, department = 'HR' WHERE id = 2;",
                "description": "Updates both salary and department for the employee with id 2."
            },
            {
                "heading": "Updating All Rows",
                "code": "UPDATE employees SET department = 'General';",
                "description": "Updates the department of all employees to 'General'."
            },
            {
                "heading": "UPDATE with JOIN",
                "code": "UPDATE employees e JOIN departments d ON e.department_id = d.id SET e.salary = e.salary * 1.1 WHERE d.department_name = 'Sales';",
                "description": "Increases the salary of all employees in the 'Sales' department by 10%."
            },
            {
                "heading": "UPDATE with ORDER BY and LIMIT",
                "code": "UPDATE employees SET salary = salary + 5000 ORDER BY hire_date ASC LIMIT 5;",
                "description": "Increases the salary of the 5 longest-serving employees by 5000."
            },
            {
                "heading": "Preventing Full Table Updates",
                "code": "UPDATE employees SET salary = 70000 WHERE id = 3; -- Always use WHERE to avoid updating all rows.",
                "description": "Using WHERE is crucial to avoid unintended updates on all rows."
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
