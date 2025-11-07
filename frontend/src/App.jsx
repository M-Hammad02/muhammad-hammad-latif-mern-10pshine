import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import DashboardPage from "./pages/Dashboard";

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
              <Route path="/" element={<ProtectedRoute><DashboardPage query={query} setQuery={setQuery} filterBy={filterBy} setFilterBy={setFilterBy} /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
