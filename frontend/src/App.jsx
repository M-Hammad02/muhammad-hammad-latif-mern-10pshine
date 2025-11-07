import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Layout/Navbar";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import DashboardPage from "./pages/Dashboard";
import EditorPage from "./pages/EditorPage";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ProfilePage from "./pages/ProfilePage";
export default function App(){
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-100">
          <Navbar query={query} setQuery={setQuery} filterBy={filterBy} setFilterBy={setFilterBy} />
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/add" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
              <Route path="/" element={<ProtectedRoute><DashboardPage query={query} setQuery={setQuery} filterBy={filterBy} setFilterBy={setFilterBy} /></ProtectedRoute>} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
