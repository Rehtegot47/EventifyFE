import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <h1 className="text-7xl font-bold text-eventify-500">404</h1>
      <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Page not found</p>
      <p className="mt-2 text-gray-500 dark:text-gray-500">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 px-6 py-2.5 bg-eventify-500 text-white rounded-lg font-medium hover:bg-eventify-600 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
