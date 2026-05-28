console.log("APP RENDERED");

import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import TodoPage from "./pages/TodoPage";
import Settings from "./pages/Settings";
import Layout from "./pages/Layout";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>

        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <TodoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

      </Route>

    </Routes>
  );
}

export default App;