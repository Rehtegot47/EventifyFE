import { useState, useEffect } from "react";
import { FiTag, FiSearch } from "react-icons/fi";
import { getUserTickets } from "../services/ticketService";
import TicketCard from "../components/TicketCard";
import LoadingSpinner from "../components/LoadingSpinner";

const tabs = [
  { key: "all", label: "All" },
  { key: "ACTIVE", label: "Upcoming" },
  { key: "USED", label: "Used" },
  { key: "CANCELLED", label: "Cancelled" },
];

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUserTickets()
      .then((res) => setTickets(Array.isArray(res) ? res : []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tickets.filter((t) => {
    const matchFilter =
      filter === "all" || (t.status || "").toUpperCase() === filter.toUpperCase();
    const matchSearch =
      !search ||
      (t.eventTitle || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.ticketType || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: tickets.length,
    ACTIVE: tickets.filter((t) => (t.status || "").toUpperCase() === "ACTIVE").length,
    USED: tickets.filter((t) => (t.status || "").toUpperCase() === "USED").length,
    CANCELLED: tickets.filter((t) => (t.status || "").toUpperCase() === "CANCELLED").length,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <FiTag className="text-emerald-600 dark:text-emerald-400 text-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Tickets</h1>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm ml-[52px]">
          View and manage your purchased tickets
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search by event name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white placeholder-gray-400"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const active = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`shrink-0 px-4 py-2 text-sm rounded-xl font-medium transition cursor-pointer ${
                active
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner size="lg" className="py-16" />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <FiTag className="text-2xl text-gray-300 dark:text-gray-500" />
          </div>
          <p className="text-gray-900 dark:text-white font-semibold text-lg">
            {search || filter !== "all" ? "No matching tickets" : "No tickets yet"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
            {search || filter !== "all"
              ? "Try adjusting your search or filters"
              : "Browse events and purchase your first ticket!"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((t) => (
            <TicketCard key={t._id || t.id} ticket={t} />
          ))}
        </div>
      )}
    </div>
  );
}
