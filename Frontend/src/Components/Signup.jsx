import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      navigate("/login"); // Redirect after signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <input 
            type="text" placeholder="Name" value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input 
            type="email" placeholder="Email" value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input 
            type="password" placeholder="Password" value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
