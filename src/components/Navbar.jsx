import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FiLogOut, FiUser, FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const close = () => setMobileOpen(false);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-bold text-eventify-600">Eventify</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/events" className="text-gray-600 dark:text-gray-300 hover:text-eventify-600 dark:hover:text-eventify-400 font-medium transition">
            Events
          </Link>
          <a href="/#pricing" className="text-gray-600 dark:text-gray-300 hover:text-eventify-600 dark:hover:text-eventify-400 font-medium transition">
            Pricing
          </a>
          <a href="/#faq" className="text-gray-600 dark:text-gray-300 hover:text-eventify-600 dark:hover:text-eventify-400 font-medium transition">
            FAQs
          </a>
          {user && (
            <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-eventify-600 dark:hover:text-eventify-400 font-medium transition">
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          </button>

          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-eventify-600 dark:hover:text-eventify-400"
              >
                <FiUser className="text-lg" />
                <span>{user.name?.split(" ")[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-eventify-500 text-white rounded-lg hover:bg-eventify-600 transition cursor-pointer"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-eventify-600 border border-eventify-500 rounded-lg hover:bg-eventify-50 dark:hover:bg-eventify-900/20 transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-eventify-500 text-white rounded-lg hover:bg-eventify-600 transition"
              >
                Get Started
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer"
          >
            {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 pb-4 pt-2">
          <div className="flex flex-col gap-1">
            <Link to="/events" onClick={close} className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition">
              Events
            </Link>
            <a href="/#pricing" onClick={close} className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition">
              Pricing
            </a>
            <a href="/#faq" onClick={close} className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition">
              FAQs
            </a>
            {user && (
              <Link to="/dashboard" onClick={close} className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition">
                Dashboard
              </Link>
            )}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={close}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-eventify-600 border border-eventify-500 rounded-lg hover:bg-eventify-50 dark:hover:bg-eventify-900/20 transition"
                >
                  <FiUser /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={close}
                  className="px-4 py-3 text-sm font-medium text-center text-eventify-600 border border-eventify-500 rounded-lg hover:bg-eventify-50 dark:hover:bg-eventify-900/20 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={close}
                  className="px-4 py-3 text-sm font-medium text-center bg-eventify-500 text-white rounded-lg hover:bg-eventify-600 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
