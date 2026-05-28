import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function AdminPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [todos, setTodos] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks");

  const API = "http://localhost:8080/api/admin";

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchAdminTodos = async () => {
    try {
      const res = await axios.get(`${API}/todos`, {
        headers: getAuthHeader(),
      });

      setTodos(res.data);
    } catch (err) {
      console.error(err);
      alert("Access denied");
      navigate("/todos");
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${API}/activities?limit=100`, {
        headers: getAuthHeader(),
      });

      setActivities(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch activities");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchAdminTodos();
      await fetchActivities();
      setLoading(false);
    };

    fetchData();
  }, []);

  const getActionColor = (action) => {
    switch (action) {
      case "TASK_CREATED":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200";
      case "TASK_COMPLETED":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200";
      case "TASK_DELETED":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200";
      case "PRIORITY_CHANGED":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200";
      case "PROFILE_UPDATED":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200";
      case "USER_REGISTERED":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold dark:text-white">
            Admin Dashboard
          </h1>

          <button
            onClick={() => navigate("/todos")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Back
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b dark:border-gray-600">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`pb-2 px-4 ${
              activeTab === "tasks"
                ? "border-b-2 border-blue-500 text-blue-500 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab("activities")}
            className={`pb-2 px-4 ${
              activeTab === "activities"
                ? "border-b-2 border-blue-500 text-blue-500 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Activity Log
          </button>
        </div>

        {activeTab === "tasks" ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-5 gap-4 mb-8">

              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-xl">
                <h2 className="text-lg font-semibold dark:text-white">
                  Total Tasks
                </h2>
                <p className="text-3xl font-bold dark:text-white">
                  {todos.length}
                </p>
              </div>

              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-xl">
                <h2 className="text-lg font-semibold dark:text-white">
                  Completed
                </h2>
                <p className="text-3xl font-bold dark:text-white">
                  {todos.filter(t => t.completed).length}
                </p>
              </div>

              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-xl">
                <h2 className="text-lg font-semibold dark:text-white">
                  Pending
                </h2>
                <p className="text-3xl font-bold dark:text-white">
                  {todos.filter(t => !t.completed).length}
                </p>
              </div>

              <div className="bg-red-100 dark:bg-red-900 p-4 rounded-xl">
                <h2 className="text-lg font-semibold dark:text-white">
                  High Priority
                </h2>
                <p className="text-3xl font-bold dark:text-white">
                  {todos.filter(t => t.priority === "HIGH").length}
                </p>
              </div>

              <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-xl">
                <h2 className="text-lg font-semibold dark:text-white">
                  Overdue
                </h2>
                <p className="text-3xl font-bold dark:text-white">
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
                  <tr className="bg-gray-200 dark:bg-gray-700 text-left">
                    <th className="p-3 dark:text-white">User</th>
                    <th className="p-3 dark:text-white">Task</th>
                    <th className="p-3 dark:text-white">Status</th>
                    <th className="p-3 dark:text-white">Priority</th>
                    <th className="p-3 dark:text-white">Due Date</th>
                    <th className="p-3 dark:text-white">Created</th>
                    <th className="p-3 dark:text-white">Completed</th>
                    <th className="p-3 dark:text-white">Deleted</th>
                  </tr>
                </thead>

                <tbody>
                  {todos.map((todo) => (
                    <tr
                      key={todo.id}
                      className="border-b hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      <td className="p-3 dark:text-white">
                        <div className="font-semibold">
                          {todo.displayName || "Unnamed"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {todo.email}
                        </div>
                      </td>

                      <td className="p-3 dark:text-white">
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

                      <td className="p-3 dark:text-white">
                        {todo.dueDate
                          ? new Date(todo.dueDate).toLocaleString()
                          : "-"}
                      </td>

                      <td className="p-3 dark:text-white">
                        {todo.createdAt
                          ? new Date(todo.createdAt).toLocaleString()
                          : "-"}
                      </td>

                      <td className="p-3 dark:text-white">
                        {todo.completedAt
                          ? new Date(todo.completedAt).toLocaleString()
                          : "-"}
                      </td>

                      <td className="p-3 dark:text-white">
                        {todo.deletedAt
                          ? new Date(todo.deletedAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </>
        ) : (
          <>
            {/* Activity Log */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold dark:text-white mb-4">
                Activity Log ({activities.length} activities)
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">

                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700 text-left">
                    <th className="p-3 dark:text-white">Time</th>
                    <th className="p-3 dark:text-white">User</th>
                    <th className="p-3 dark:text-white">Action</th>
                    <th className="p-3 dark:text-white">Task</th>
                    <th className="p-3 dark:text-white">Details</th>
                  </tr>
                </thead>

                <tbody>
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No activities recorded yet
                      </td>
                    </tr>
                  ) : (
                    activities.map((activity) => (
                      <tr
                        key={activity.id}
                        className="border-b hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                      >
                        <td className="p-3 dark:text-white text-sm">
                          {activity.timestamp
                            ? new Date(activity.timestamp).toLocaleString()
                            : "-"}
                        </td>
                        <td className="p-3 dark:text-white">
                          <div className="font-semibold">
                            {activity.userDisplayName || "Unnamed"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.userEmail}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                            {activity.action.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-3 dark:text-white">
                          {activity.taskTitle || "-"}
                        </td>
                        <td className="p-3 dark:text-white text-sm">
                          {activity.details || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPage;