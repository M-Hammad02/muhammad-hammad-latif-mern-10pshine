import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.ok) setMessage("Password reset link sent to your email");
      else setError(data.message || "Failed to send email");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-primary">
      {/* LEFT SIDE - Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img
          src="/images/InitialPageNotesImage.svg"
          alt="Notes illustration"
          className="max-w-[70%] rounded-xl object-contain"
        />
      </div>

      {/* RIGHT SIDE - Forgot Password Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="max-w-md w-full bg-primary p-6 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-secondary">
            Forgot Password
          </h2>

          {message && (
            <div className="mb-3 text-secondary text-center font-medium">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-3 text-red-600 text-center font-medium">
              {error}
            </div>
          )}

          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            className="w-full p-2 border rounded mb-3"
          />

          <button
            type="submit"
            className="w-full px-4 py-2 bg-secondary text-primary rounded hover:bg-secondary transition"
          >
            Send Reset Link
          </button>

          <div className="text-center mt-4">
            <Link to="/login" className="text-secondary hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
