import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
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
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Welcome Back</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
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
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-3 text-center">
        <Link to="/forgot-password" className="text-sm text-eventify-600 hover:underline">
          Forgot Password?
        </Link>
      </div>

      <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-eventify-600 font-medium hover:underline">
          Register
        </Link>
      </p>
      <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
        Are you a scanner?{" "}
        <Link to="/scanner-sign-in" className="text-eventify-600 font-medium hover:underline">
          Scanner sign in
        </Link>
      </p>
    </div>
  );
}
