import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:8080/api/admin/todos";

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchAdminTodos = async () => {
    try {
      const res = await axios.get(API, {
        headers: getAuthHeader(),
      });

      setTodos(res.data);
    } catch (err) {
      console.error(err);
      alert("Access denied");

      navigate("/todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminTodos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>

          <button
            onClick={() => navigate("/todos")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Back
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">

        <div className="bg-blue-100 p-4 rounded-xl">
            <h2 className="text-lg font-semibold">
            Total Tasks
            </h2>

            <p className="text-3xl font-bold">
            {todos.length}
            </p>
        </div>

        <div className="bg-green-100 p-4 rounded-xl">
            <h2 className="text-lg font-semibold">
            Completed
            </h2>

            <p className="text-3xl font-bold">
            {todos.filter(t => t.completed).length}
            </p>
        </div>

        <div className="bg-yellow-100 p-4 rounded-xl">
            <h2 className="text-lg font-semibold">
            Pending
            </h2>

            <p className="text-3xl font-bold">
            {todos.filter(t => !t.completed).length}
            </p>
        </div>

        <div className="bg-red-100 p-4 rounded-xl">
            <h2 className="text-lg font-semibold">
            High Priority
            </h2>

            <p className="text-3xl font-bold">
            {todos.filter(t => t.priority === "HIGH").length}
            </p>
        </div>

        <div className="bg-purple-100 p-4 rounded-xl">
            <h2 className="text-lg font-semibold">
            Overdue
            </h2>

            <p className="text-3xl font-bold">
            {
                todos.filter(t =>
                t.dueDate &&
                new Date(t.dueDate) < new Date() &&
                !t.completed
                ).length
            }
            </p>
        </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">

            <thead>
            <tr className="bg-gray-200 text-left">
                <th className="p-3">User</th>
                <th className="p-3">Task</th>
                <th className="p-3">Status</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Created</th>
                <th className="p-3">Completed</th>
                <th className="p-3">Deleted</th>
            </tr>
            </thead>

            <tbody>
              {todos.map((todo) => (
                <tr
                  key={todo.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">
                    <div className="font-semibold">
                      {todo.displayName || "Unnamed"}
                    </div>

                    <div className="text-sm text-gray-500">
                      {todo.email}
                    </div>
                  </td>

                  <td className="p-3">
                    {todo.title}
                  </td>

                  <td className="p-3">
                    {todo.completed ? (
                        <span className="text-green-600 font-semibold">
                        Completed
                        </span>
                    ) : todo.dueDate &&
                        new Date(todo.dueDate) < new Date() ? (
                        <span className="text-red-600 font-bold">
                        OVERDUE
                        </span>
                    ) : (
                        <span className="text-yellow-600 font-semibold">
                        Pending
                        </span>
                    )}
                </td>

                  <td className="p-3">
                <span
                    className={
                    todo.priority === "HIGH"
                        ? "text-red-600 font-bold"
                        : todo.priority === "MEDIUM"
                        ? "text-yellow-600 font-bold"
                        : "text-green-600 font-bold"
                    }
                >
                    {todo.priority || "LOW"}
                </span>
                </td>

                <td className="p-3">
                {todo.dueDate
                    ? new Date(todo.dueDate).toLocaleString()
                    : "-"}
                </td>

                <td className="p-3">
                {todo.createdAt || "-"}
                </td>

                  <td className="p-3">
                    {todo.completedAt || "-"}
                  </td>

                  <td className="p-3">
                    {todo.deletedAt || "-"}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;