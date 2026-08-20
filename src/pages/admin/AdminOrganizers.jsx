import { useState, useEffect } from "react";
import { getAdminOrganizers } from "../../services/adminService";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminOrganizers() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminOrganizers()
      .then(setOrganizers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = organizers.filter(
    (o) =>
      o.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner className="mt-20" size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Organizers
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search organizers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-eventify-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((org) => (
          <div
            key={org.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-eventify-100 dark:bg-eventify-900/30 text-eventify-600 dark:text-eventify-400 flex items-center justify-center font-bold text-sm">
                {org.fullName?.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {org.fullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {org.email}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Events</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {org.eventCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Total Earned
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₦{Number(org.totalEarned).toLocaleString()}
                </span>
              </div>
              {org.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Phone</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {org.phone}
                  </span>
                </div>
              )}
            </div>

            {org.bankName && (
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Bank Details
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {org.bankName} - {org.accountNumber}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {org.accountName}
                </p>
              </div>
            )}

            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              Joined{" "}
              {org.createdAt
                ? new Date(org.createdAt).toLocaleDateString()
                : "-"}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
            No organizers found.
          </p>
        )}
      </div>
    </div>
  );
}
