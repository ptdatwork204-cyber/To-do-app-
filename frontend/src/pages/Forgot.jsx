import { Link } from "react-router-dom";

export default function Forgot() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Enter your email"
        />

        <button className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600">
          Send Reset Link
        </button>

        <p className="mt-3 text-sm text-center">
          <Link to="/login" className="text-blue-500">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}