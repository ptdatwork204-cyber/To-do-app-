import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Register() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        email,
        password,
      });

      alert("Register success");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-80">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Register</h1>

        <input
          className="w-full border p-2 rounded mb-3 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 rounded mb-3 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Create Account
        </button>

        <p className="mt-3 text-sm text-center dark:text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="mt-4 w-full text-center text-gray-500 dark:text-gray-400 text-sm"
        >
          {darkMode ? "☀️ Switch to Light Mode" : "🌙 Switch to Dark Mode"}
        </button>

      </div>
    </div>
  );
}