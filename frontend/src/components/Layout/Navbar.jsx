import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import SearchBar from "../Shared/SearchBar";

export default function Navbar({ query, setQuery, filterBy, setFilterBy }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const nav = useNavigate();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password");

  const isProfilePage = location.pathname === "/profile";
  const isHomePage = location.pathname === "/"; // ✅ added this check

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="flex items-center justify-between p-6 bg-secondary text-primary">
      <div className="flex items-center gap-4">
        {/* <Link to="/" className="font-extrabold text-4xl">
          NoteFlow
        </Link> */}
        <Link
  to={user ? "/dashboard" : "/"}
  className="font-extrabold text-4xl"
>
  NoteFlow
</Link>
      </div>

      {/* ✅ Hide navbar content on auth pages */}
      {!isAuthPage && (
        <div className="flex items-center gap-3">
          {/* ✅ Hide SearchBar on Home and Profile pages */}
          {!isProfilePage && !isHomePage && (
            <SearchBar
              query={query}
              setQuery={setQuery}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
            />
          )}

          {user ? (
            <>
              {/* ✅ Avatar or initials */}
              <div
                className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold cursor-pointer overflow-hidden"
                onClick={() => nav("/profile")}
              >
                {user.avatar ? (
                  <img
                    src={`http://localhost:5000${user.avatar}`}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <span>{getInitials(user.name)}</span>
                )}
              </div>

              <button
                className="px-3 py-1 bg-primary rounded text-black hover:bg-secondary hover:text-primary text-md font-semibold"
                onClick={() => {
                  logout();
                  nav("/login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-1 bg-primary rounded text-black hover:bg-secondary hover:text-primary text-md font-semibold">
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
