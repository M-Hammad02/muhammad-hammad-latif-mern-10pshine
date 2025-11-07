import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  // Remove scrollbars globally on this page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.margin = "0";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    const res = await login(email, password);
    if (res.ok) nav("/");
    else if (
        res.message?.toLowerCase().includes("invalid") ||
        res.message?.toLowerCase().includes("failed")
      ) {
        setError("Invalid email or password");
      } else {
        setError(res.message || "Login failed");
      }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-primary m-0">
      {/* LEFT SIDE - Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img
          src="/images/InitialPageNotesImage.svg"
          alt="Notes illustration"
          className="max-w-[70%] rounded-xl object-contain"
        />
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="max-w-md w-full bg-primary p-6 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-secondary">
            Login
          </h2>

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
            placeholder="Email"
            className="w-full p-2 border rounded mb-3"
          />

          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded mb-3"
          />

          <div className="text-right mb-3">
            <Link to="/forgot-password" className="text-sm text-secondary hover:underline">
              Forgot Password?
            </Link>
          </div>

          <div className="flex gap-2 justify-between">
            <button
              type="submit"
              className="w-[140px] px-4 py-2 bg-secondary text-primary rounded hover:bg-secondary transition"
            >
              Login
            </button>
            <Link
              to="/register"
              className="w-[140px] px-4 py-2 border rounded  bg-secondary text-primary hover:bg-secondary transition text-center"
            >
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
