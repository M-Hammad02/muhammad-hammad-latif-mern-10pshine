import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  // Disable scrolling completely on this page
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

    // Password match validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await register({ name, email, password });
    if (res.ok) nav("/");
    else setError(res.message || "Registration failed");
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

      {/* RIGHT SIDE - Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="max-w-md w-full bg-primary p-6 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-secondary">
            Create Account
          </h2>

          {error && (
            <div className="mb-2 text-red-600 text-center">{error}</div>
          )}

          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full p-2 border rounded mb-3"
          />

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

          <input
            required
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full p-2 border rounded mb-4"
          />

          <div className="flex gap-2 justify-between">
            <button
              type="submit"
              className="w-[140px] px-4 py-2 bg-secondary text-primary rounded hover:bg-secondary transition"
            >
              Sign up
            </button>
            <Link
              to="/login"
              className="w-[140px] px-4 py-2 border bg-secondary text-primary rounded hover:bg-secondary transition text-center"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
