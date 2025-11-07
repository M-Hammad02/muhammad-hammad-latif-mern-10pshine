import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Layout/Navbar";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import EditorPage from "./pages/EditorPage";

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
              <Route path="/add" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
