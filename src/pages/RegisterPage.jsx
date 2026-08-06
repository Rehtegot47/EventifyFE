import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiCalendar } from "react-icons/fi";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("role");
  const [role, setRole] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRoleSelect = (selected) => {
    setRole(selected.toUpperCase());
    setStep("form");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return toast.error("All fields are required");
    }
    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    setSubmitting(true);
    try {
      const selectedRole = role.toUpperCase() || "ATTENDEE";
      await register({ name: form.name, email: form.email, password: form.password, role: selectedRole });
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "role") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Create Account</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1">Join Eventify today</p>

        <p className="text-gray-600 dark:text-gray-300 text-center mt-6 font-medium">What would you like to do?</p>

        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={() => handleRoleSelect("ATTENDEE")}
            className="flex items-center gap-4 w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-eventify-500 hover:bg-eventify-50 dark:hover:bg-eventify-900/20 transition cursor-pointer text-left group"
          >
            <div className="w-12 h-12 rounded-full bg-eventify-100 dark:bg-eventify-900/30 flex items-center justify-center shrink-0 group-hover:bg-eventify-200 dark:group-hover:bg-eventify-800/40 transition">
              <FiUser className="text-xl text-eventify-600 dark:text-eventify-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Attend an Event</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Browse and buy tickets to events</p>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect("ORGANIZER")}
            className="flex items-center gap-4 w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-eventify-500 hover:bg-eventify-50 dark:hover:bg-eventify-900/20 transition cursor-pointer text-left group"
          >
            <div className="w-12 h-12 rounded-full bg-eventify-100 dark:bg-eventify-900/30 flex items-center justify-center shrink-0 group-hover:bg-eventify-200 dark:group-hover:bg-eventify-800/40 transition">
              <FiCalendar className="text-xl text-eventify-600 dark:text-eventify-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Create an Event</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Organize and sell tickets to your events</p>
            </div>
          </button>
        </div>

        <p className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-eventify-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <button
        onClick={() => setStep("role")}
        className="text-sm text-eventify-600 hover:underline mb-4 cursor-pointer"
      >
        &larr; Back
      </button>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
        {role === "ORGANIZER" ? "Organizer" : "Attendee"} Account
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1">
        {role === "ORGANIZER"
          ? "Set up your organizer profile"
          : "Start discovering amazing events"}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="mt-1 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventify-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
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
            placeholder="At least 6 characters"
            className="mt-1 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventify-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat password"
            className="mt-1 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventify-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-eventify-500 text-white py-2.5 rounded-lg font-semibold hover:bg-eventify-600 transition disabled:opacity-60 cursor-pointer"
        >
          {submitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="text-eventify-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
