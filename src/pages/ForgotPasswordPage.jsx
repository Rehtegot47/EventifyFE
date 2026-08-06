import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiCheck } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter your email address");
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheck className="text-xl text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Check your email</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          We sent a password reset link to <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span>
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
          Didn&apos;t receive the email? Check your spam folder or{" "}
          <button onClick={() => setSubmitted(false)} className="text-eventify-600 hover:underline cursor-pointer">
            try again
          </button>
        </p>
        <Link to="/login" className="mt-6 inline-block text-sm text-eventify-600 font-medium hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div className="w-12 h-12 bg-eventify-50 dark:bg-eventify-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
        <FiMail className="text-xl text-eventify-600 dark:text-eventify-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Forgot Password?</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1">
        Enter your email and we&apos;ll send you a reset link
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventify-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-eventify-500 text-white py-2.5 rounded-lg font-semibold hover:bg-eventify-600 transition disabled:opacity-60 cursor-pointer"
        >
          {submitting ? "Sending..." : "Send Reset Email"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
        Remember your password?{" "}
        <Link to="/login" className="text-eventify-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
