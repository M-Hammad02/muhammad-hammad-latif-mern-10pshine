import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect logged-in users to dashboard
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  // ✅ Disable scrollbars (same as Login)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.margin = "0";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-primary m-0">
      {/* LEFT SIDE — TEXT CONTENT */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-10 space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">
          NoteFlow — fast, private notes
        </h1>

        <p className="text-gray-700 text-lg leading-relaxed">
          Create, organize and secure your notes. Folders, secret notes, file attachments, 
          search & filters, and a rich text editor powered by Quill — all integrated with your MERN backend.
        </p>

        <div className="flex gap-4">
          <Link
            to="/register"
            className="px-6 py-2 border-primary border-2 bg-secondary hover:bg-primary text-primary hover:text-secondary rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.3)] font-semibold transition-all duration-300"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="px-6 py-2 border-2 border-secondary rounded-lg bg-primary hover:bg-secondary text-secondary hover:text-primary shadow-[0_0_10px_rgba(0,0,0,0.3)] font-semibold transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE — IMAGE */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img
          src="/images/HomePageImage.svg"
          alt="NoteFlow preview"
          className="max-w-[80%] rounded-xl object-contain"
        />
      </div>
    </div>
  );
}
