import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Fingerprint } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full p-4 flex justify-between items-center bg-gray-900 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <Fingerprint className="text-red-500" size={24} />
          </motion.div>
          <h1 className="text-2xl font-bold text-red-500">Crime Investigation</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-all duration-300 text-white rounded-md"
        >
          Login
        </motion.button>
      </motion.nav>

      <div className="flex flex-col justify-center items-center flex-grow text-center p-8 relative">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.5 }}
          className="absolute w-64 h-64 bg-red-500 rounded-full blur-3xl"
        />
        
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold text-red-500 relative z-10"
        >
          "The truth is always found at the crime scene."
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-gray-400 mt-4 text-lg max-w-2xl"
        >
          Unravel mysteries, track criminals, and deliver justice. 
          Our database-driven investigation system helps you connect 
          the dots and solve even the most complex cases.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(220, 38, 38, 0.5)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/login")}
          className="mt-6 px-6 py-3 text-lg font-semibold bg-red-600 hover:bg-red-700 transition-all duration-300 rounded-md shadow-lg"
        >
          <div className="flex items-center gap-2">
            <span>Start Investigating</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 1, duration: 1 }}
            >
              →
            </motion.span>
          </div>
        </motion.button>
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="p-4 text-center text-gray-500 bg-gray-900"
      >
        <motion.div
          whileHover={{ color: "#ef4444" }}
          transition={{ duration: 0.3 }}
        >
          © 2025 Crime Investigation System | Solve, Track, and Secure
        </motion.div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;