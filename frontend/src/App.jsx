import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";


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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
