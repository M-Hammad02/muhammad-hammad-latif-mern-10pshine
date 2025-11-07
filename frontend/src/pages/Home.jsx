import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, send straight to dashboard/home
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white p-6">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-slate-800">NoteFlow — fast, private notes</h1>
          <p className="text-gray-600">
            Create, organize and secure your notes. Folders, secret notes, file attachments, search & filters,
            and a rich text editor powered by Quill — all ready to integrate with your MERN backend.
          </p>

          <div className="flex gap-3">
            <Link to="/register" className="px-5 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700">Get Started</Link>
            <Link to="/login" className="px-5 py-2 border rounded">Sign in</Link>
          </div>

          <ul className="text-sm text-gray-600 space-y-2 mt-4">
            <li>• Create & edit rich-text notes</li>
            <li>• Organize notes by folders & mark secret notes</li>
            <li>• Search & filter by title / description</li>
            <li>• Upload files & user avatar support</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-3">Quick demo</h3>
          <div className="text-sm text-gray-600 space-y-3">
            <p><strong>Login / Register:</strong> Create an account to see your personal notes.</p>
            <p><strong>Dashboard:</strong> Lists notes with sort (latest/oldest) and folder filtering.</p>
            <p><strong>Editor:</strong> Rich editor (React-Quill) with attachments and secret-note toggle.</p>
            <p className="text-xs text-gray-400">Tip: If your backend is running on another port, set `baseURL` in `src/utils/api.js`.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
