import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.ok) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setError(data.message || "Failed to reset password");
      }
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

      {/* RIGHT SIDE - Reset Password Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="max-w-md w-full bg-primary p-6 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-secondary">
            Reset Password
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="w-full p-2 border rounded mb-3"
          />

          <input
            required
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            className="w-full p-2 border rounded mb-3"
          />

          <button
            type="submit"
            className="w-full px-4 py-2 bg-secondary text-primary rounded hover:bg-secondary transition"
          >
            Reset Password
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
