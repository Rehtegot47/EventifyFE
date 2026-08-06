import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function ScannerLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("All fields are required");
    setSubmitting(true);
    try {
      const res = await login(form.email, form.password);
      if (res.user?.role !== "scanner" && res.user?.role !== "organizer") {
        toast.error("Scanner access only. Use organizer login for dashboard.");
        localStorage.removeItem("eventify_token");
        localStorage.removeItem("eventify_user");
        return;
      }
      toast.success("Welcome!");
      navigate("/dashboard/scan");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div className="w-12 h-12 bg-eventify-50 dark:bg-eventify-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
        <svg className="w-6 h-6 text-eventify-600 dark:text-eventify-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Scanner Sign In</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1">Scan tickets at the door</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="scanner@example.com"
            className="mt-1 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventify-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="mt-1 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventify-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-eventify-500 text-white py-2.5 rounded-lg font-semibold hover:bg-eventify-600 transition disabled:opacity-60 cursor-pointer"
        >
          {submitting ? "Signing in..." : "Sign In as Scanner"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
        Organizer account?{" "}
        <Link to="/login" className="text-eventify-600 font-medium hover:underline">
          Use organizer sign in
        </Link>
      </p>
    </div>
  );
}
