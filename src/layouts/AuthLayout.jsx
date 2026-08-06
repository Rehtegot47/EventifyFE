import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-eventify-500 to-eventify-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-6">
          <span className="text-3xl font-bold text-white">Eventify</span>
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
