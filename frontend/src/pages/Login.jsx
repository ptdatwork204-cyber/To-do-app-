import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password); //  handled by AuthContext
      navigate("/todos");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80">

        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <input
          className="w-full border p-2 rounded mb-3"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 rounded mb-3"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>

        <div className="flex justify-between mt-3 text-sm">
          <Link to="/register" className="text-blue-500">Register</Link>
          <Link to="/forgot" className="text-blue-500">Forgot?</Link>
        </div>

      </div>
    </div>
  );
}