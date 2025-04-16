import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("https://sql-murder-mystery.vercel.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      console.log("Storing token:", data.token);
      localStorage.setItem("token", data.token);
      console.log("Token stored:", localStorage.getItem("token"));
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: "url('/login_bg.jpeg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50 z-0"></div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 z-10"></div>

      <div className="absolute inset-0 z-0 opacity-30">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-red-600/20"
            style={{
              width: Math.random() * 10 + 5 + "px",
              height: Math.random() * 10 + 5 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animation: `float ${Math.random() * 10 + 15}s linear infinite`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="backdrop-blur-sm bg-black/60 p-8 rounded-lg shadow-2xl border-t border-red-700/50 border-l border-r border-b-2 border-b-red-600">

          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 mb-3 relative">
              <div className="absolute inset-0 rounded-full border-2 border-red-600 animate-pulse"></div>
              <div className="absolute inset-2 bg-black/80 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-wider">
              <span className="text-red-600">CRIME</span> SCENE
            </h2>
            <p className="text-gray-300 text-sm mt-1">Secure Authentication Portal</p>
          </div>


          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border-l-4 border-red-600 rounded">
              <p className="text-red-400 text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-4 pr-10 bg-gray-900/70 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <div className="h-5 w-5 text-gray-500"></div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-4 pr-10 bg-gray-900/70 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <div className="h-5 w-5 text-gray-500"></div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-red-400 hover:text-red-300 transition-colors duration-300"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-all duration-300 relative overflow-hidden group ${
                isLoading ? "bg-gray-700" : "bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-700"
              }`}
            >
              <span className="absolute inset-0 w-0 bg-white/10 transition-all duration-300 ease-out group-hover:w-full"></span>
              <span className="relative flex items-center justify-center">
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                )}
                {isLoading ? "Authenticating..." : "Login"}
              </span>
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center space-x-2">
            <span className="flex-grow h-px bg-gray-700"></span>
            <span className="text-xs text-gray-400">OR</span>
            <span className="flex-grow h-px bg-gray-700"></span>
          </div>

          <p className="mt-6 text-center text-sm text-gray-300">
            Don't have an account?{" "}
            <button
              className="font-medium text-red-500 hover:text-red-400 transition-colors duration-300 relative group"
              onClick={() => navigate("/signup")}
            >
              Sign Up
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </p>
        </div>

        <div className="text-center mt-6 text-xs text-gray-300">
          <p>© {new Date().getFullYear()} Crime Scene Investigation. All rights reserved.</p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Login;
