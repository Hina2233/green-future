import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="flex justify-between items-center py-4 px-6">
        <div>
          <Link
            to="/home-page"
            className="text-xl font-bold hover:text-gray-200"
          >
            Idea Collection
          </Link>
        </div>

        <div className="space-x-4">
          <Link to="/home-page" className="hover:text-gray-200">
            Home
          </Link>
          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="hover:text-gray-200 focus:outline-none"
              >
                Logout
              </button>
              <Link to="/offline-submissions" className="hover:text-gray-200">
                Offline Submissions
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-200">
                Login
              </Link>
              <Link to="/role-selection" className="hover:text-gray-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
