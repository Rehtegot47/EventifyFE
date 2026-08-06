import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { getMyEvents, deleteEvent } from "../services/eventService";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ManageEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyEvents()
      .then((res) => setEvents(Array.isArray(res) ? res : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      setEvents(events.filter((e) => e._id !== id));
      toast.success("Event deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete event");
    }
  };

  const statusBadge = (date, status) => {
    if (status === "CANCELLED") return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    if (status === "COMPLETED") return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    const isPast = new Date(date) < new Date();
    return isPast
      ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
      : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
  };

  const statusLabel = (date, status) => {
    if (status === "CANCELLED") return "Cancelled";
    if (status === "COMPLETED") return "Completed";
    return new Date(date) > new Date() ? "Active" : "Past";
  };

  if (loading) return <LoadingSpinner size="lg" className="py-20" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Events</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Create, edit, and manage your events</p>
        </div>
        <Link
          to="/dashboard/events/new"
          className="px-4 py-2.5 bg-eventify-500 text-white rounded-lg text-sm font-medium hover:bg-eventify-600 transition flex items-center gap-1.5"
        >
          <FiPlus /> New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <p className="text-gray-500 dark:text-gray-400">You haven&apos;t created any events yet.</p>
          <button
            onClick={() => navigate("/dashboard/events/new")}
            className="mt-4 px-6 py-2 bg-eventify-500 text-white rounded-lg font-medium hover:bg-eventify-600 transition cursor-pointer"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-6 py-3 font-medium text-gray-600 dark:text-gray-400">Event</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600 dark:text-gray-400">Price</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-right px-6 py-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt._id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <img src={evt.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=100&q=80"} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{evt.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {new Date(evt.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {evt.price > 0 ? `\u20A6${evt.price.toFixed(2)}` : "Free"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusBadge(evt.date, evt.status)}`}>
                      {statusLabel(evt.date, evt.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/events/${evt.slug}`)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition cursor-pointer"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(evt._id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition cursor-pointer"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
