import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  FiCalendar, FiDollarSign, FiTag, FiPlus, FiArrowRight, FiTrash2, FiCopy, FiExternalLink,
} from "react-icons/fi";
import { getMyEvents, getEventAnalytics } from "../services/eventService";
import { getUserTickets } from "../services/ticketService";
import {
  getDiscountCodes,
  createDiscountCode,
  deleteDiscountCode,
  generateReferral,
  getMyReferrals,
} from "../services/promoService";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const isOrganizer = user?.role === "organizer";

  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [analytics, setAnalytics] = useState({ months: [], totalRevenue: 0, totalTicketsSold: 0 });
  const [loading, setLoading] = useState(true);

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [loadingPromos, setLoadingPromos] = useState(false);

  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [newDiscount, setNewDiscount] = useState({ code: "", type: "PERCENTAGE", value: 10, maxUsage: 100 });
  const [creatingDiscount, setCreatingDiscount] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (isOrganizer) {
          const evts = await getMyEvents();
          setEvents(evts);
          if (evts.length > 0) {
            setSelectedEventId(evts[0].id);
            try {
              const ana = await getEventAnalytics(evts[0].id);
              setAnalytics(ana);
            } catch {
              setAnalytics({ months: [], totalRevenue: 0, totalTicketsSold: 0 });
            }
          }
          try {
            const refs = await getMyReferrals();
            setReferrals(Array.isArray(refs) ? refs : []);
          } catch {
            setReferrals([]);
          }
        } else {
          const tkts = await getUserTickets();
          setTickets(Array.isArray(tkts) ? tkts : []);
        }
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOrganizer]);

  useEffect(() => {
    if (!selectedEventId || !isOrganizer) return;
    setLoadingPromos(true);
    getDiscountCodes(selectedEventId)
      .then((d) => setDiscounts(Array.isArray(d) ? d : []))
      .catch(() => setDiscounts([]))
      .finally(() => setLoadingPromos(false));
  }, [selectedEventId, isOrganizer]);

  if (loading) return <LoadingSpinner size="lg" className="py-20" />;

  const totalRevenue = isOrganizer
    ? analytics.totalRevenue || events.reduce((s, e) => s + (e.price || 0) * (e.ticketsSold || 0), 0)
    : tickets.reduce((s, t) => s + (t.totalAmount ?? t.price ?? 0), 0);

  const stats = isOrganizer
    ? [
        { label: "Total Events", value: events.length, icon: <FiCalendar />, color: "bg-eventify-50 dark:bg-eventify-900/20 text-eventify-600 dark:text-eventify-400" },
        { label: "Tickets Sold", value: analytics.totalTicketsSold || events.reduce((s, e) => s + (e.ticketsSold || 0), 0), icon: <FiTag />, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
        { label: "Revenue", value: `\u20A6${totalRevenue.toFixed(0)}`, icon: <FiDollarSign />, color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" },
        { label: "Active Events", value: events.filter((e) => new Date(e.date) > new Date()).length, icon: <FiCalendar />, color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
      ]
    : [
        { label: "Tickets Purchased", value: tickets.length, icon: <FiTag />, color: "bg-eventify-50 dark:bg-eventify-900/20 text-eventify-600 dark:text-eventify-400" },
        { label: "Upcoming Events", value: tickets.filter((t) => (t.status || "").toUpperCase() === "ACTIVE").length, icon: <FiCalendar />, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
        { label: "Used Tickets", value: tickets.filter((t) => (t.status || "").toUpperCase() === "USED").length, icon: <FiTag />, color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" },
        { label: "Total Spent", value: `\u20A6${totalRevenue.toFixed(0)}`, icon: <FiDollarSign />, color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
      ];

  const chartData = analytics.months?.length > 0
    ? analytics.months
    : [
        { month: "Jan", tickets: 0, revenue: 0 },
        { month: "Feb", tickets: 0, revenue: 0 },
        { month: "Mar", tickets: 0, revenue: 0 },
        { month: "Apr", tickets: 0, revenue: 0 },
        { month: "May", tickets: 0, revenue: 0 },
        { month: "Jun", tickets: 0, revenue: 0 },
      ];

  const handleCreateDiscount = async (e) => {
    e.preventDefault();
    if (!selectedEventId) return;
    setCreatingDiscount(true);
    try {
      const created = await createDiscountCode(selectedEventId, newDiscount);
      setDiscounts((prev) => [created, ...prev]);
      setShowDiscountForm(false);
      setNewDiscount({ code: "", type: "PERCENTAGE", value: 10, maxUsage: 100 });
      toast.success("Discount code created!");
    } catch (err) {
      toast.error(err.message || "Failed to create code");
    } finally {
      setCreatingDiscount(false);
    }
  };

  const handleDeleteDiscount = async (discountId) => {
    if (!selectedEventId) return;
    try {
      await deleteDiscountCode(selectedEventId, discountId);
      setDiscounts((prev) => prev.filter((d) => d.id !== discountId));
      toast.success("Discount code deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete code");
    }
  };

  const handleGenerateReferral = async (eventId) => {
    try {
      const ref = await generateReferral(eventId);
      setReferrals((prev) => {
        const exists = prev.find((r) => r.code === ref.code);
        if (exists) return prev;
        return [ref, ...prev];
      });
      toast.success("Referral link generated!");
    } catch (err) {
      toast.error(err.message || "Failed to generate referral");
    }
  };

  const selectedEvent = events.find((e) => (e.id || e._id) === selectedEventId);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || "User"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Here&apos;s what&apos;s happening with your {isOrganizer ? "events" : "tickets"} today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.color}`}>
              <div className="flex items-center justify-center h-full text-xl">{stat.icon}</div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {isOrganizer ? (
        <>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue Overview</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: "#9ca3af" }} />
                  <YAxis tick={{ fill: "#9ca3af" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--tooltip-bg, #fff)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      color: "#111827",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="tickets" fill="#10b981" radius={[4, 4, 0, 0]} name="Tickets Sold" />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Revenue (\u20A6)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">My Events</h2>
              <Link
                to="/dashboard/events"
                className="text-sm text-eventify-600 dark:text-eventify-400 hover:underline flex items-center gap-1"
              >
                Manage All <FiArrowRight />
              </Link>
            </div>
            {events.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">No events yet.</p>
                <Link
                  to="/dashboard/events/new"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-eventify-500 text-white rounded-lg text-sm font-medium hover:bg-eventify-600 transition"
                >
                  <FiPlus /> Create Event
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {events.slice(0, 5).map((e) => (
                  <Link
                    key={e.id || e._id}
                    to={`/events/${e.slug || e._id}`}
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-600/30 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{e.title}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(e.date).toLocaleDateString()} \u2022 {e.ticketsSold || 0} tickets sold
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      (e.status || "").toUpperCase() === "PUBLISHED"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}>
                      {(e.status || "DRAFT").toLowerCase()}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {events.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Discount Codes</h2>
                  <button
                    onClick={() => setShowDiscountForm(!showDiscountForm)}
                    className="flex items-center gap-1 text-sm text-eventify-600 dark:text-eventify-400 hover:underline cursor-pointer"
                  >
                    <FiPlus /> {showDiscountForm ? "Cancel" : "New Code"}
                  </button>
                </div>

                <div className="mb-4">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Select event</label>
                  <select
                    value={selectedEventId || ""}
                    onChange={(e) => setSelectedEventId(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </select>
                </div>

                {showDiscountForm && (
                  <form onSubmit={handleCreateDiscount} className="flex flex-col gap-3 mb-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Code (e.g. SUMMER20)"
                        value={newDiscount.code}
                        onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                      <select
                        value={newDiscount.type}
                        onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="PERCENTAGE">%</option>
                        <option value="FIXED">\u20A6</option>
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder={newDiscount.type === "PERCENTAGE" ? "% off" : "\u20A6 off"}
                        value={newDiscount.value}
                        onChange={(e) => setNewDiscount({ ...newDiscount, value: Number(e.target.value) })}
                        min="1"
                        max={newDiscount.type === "PERCENTAGE" ? 100 : undefined}
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                      <input
                        type="number"
                        placeholder="Max uses (0 = unlimited)"
                        value={newDiscount.maxUsage}
                        onChange={(e) => setNewDiscount({ ...newDiscount, maxUsage: Number(e.target.value) })}
                        min="0"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={creatingDiscount}
                      className="self-end px-4 py-2 bg-eventify-500 text-white rounded-lg text-sm font-medium hover:bg-eventify-600 transition cursor-pointer disabled:opacity-60"
                    >
                      {creatingDiscount ? "Creating..." : "Create"}
                    </button>
                  </form>
                )}

                {loadingPromos ? (
                  <LoadingSpinner size="sm" className="py-4" />
                ) : discounts.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No discount codes for this event.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                    {discounts.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-sm"
                      >
                        <div className="min-w-0">
                          <span className="font-mono font-semibold text-eventify-600 dark:text-eventify-400">{d.code}</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">
                            {d.type === "PERCENTAGE" ? `${d.value}% off` : `\u20A6${d.value} off`}
                          </span>
                          <span className="text-gray-400 dark:text-gray-500 ml-2 text-xs">
                            ({d.usedCount || 0}/{d.maxUsage || "\u221E"} used)
                          </span>
                          {!d.isActive && (
                            <span className="ml-2 text-xs text-red-500">inactive</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteDiscount(d.id)}
                          className="text-red-500 hover:text-red-700 transition cursor-pointer shrink-0 ml-2"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Referral Links</h2>
                  <button
                    onClick={() => selectedEventId && handleGenerateReferral(selectedEventId)}
                    disabled={!selectedEventId}
                    className="flex items-center gap-1 text-sm text-eventify-600 dark:text-eventify-400 hover:underline cursor-pointer disabled:opacity-50"
                  >
                    <FiPlus /> Generate
                  </button>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Share referral links to earn rewards when others purchase tickets.
                </p>

                {selectedEvent && (
                  <div className="mb-4 px-3 py-2 bg-eventify-50 dark:bg-eventify-900/20 rounded-lg text-xs text-eventify-700 dark:text-eventify-300">
                    Generating for: <span className="font-medium">{selectedEvent.title}</span>
                  </div>
                )}

                {referrals.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No referral links yet.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                    {referrals.map((r) => (
                      <div
                        key={r.id || r.code}
                        className="px-4 py-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <span className="font-mono font-semibold text-eventify-600 dark:text-eventify-400">{r.code}</span>
                            {r.eventTitle && (
                              <span className="text-gray-400 dark:text-gray-500 ml-2 text-xs">{r.eventTitle}</span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              const link = `${window.location.origin}/events/${r.eventId}?ref=${r.code}`;
                              navigator.clipboard.writeText(link);
                              toast.success("Referral link copied!");
                            }}
                            className="text-eventify-500 hover:text-eventify-700 transition cursor-pointer shrink-0 ml-2"
                          >
                            <FiCopy />
                          </button>
                        </div>
                        <div className="flex gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>{r.clicks || 0} clicks</span>
                          <span>{r.ticketsSold || 0} tickets sold</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Tickets</h2>
            <Link
              to="/tickets"
              className="text-sm text-eventify-600 dark:text-eventify-400 hover:underline flex items-center gap-1"
            >
              View All <FiArrowRight />
            </Link>
          </div>
          {tickets.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No tickets yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {tickets.slice(0, 5).map((t) => (
                <div
                  key={t._id || t.id}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t.eventTitle || "Event"}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {t.eventDate ? new Date(t.eventDate).toLocaleDateString() : ""}
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    (t.status || "").toUpperCase() === "ACTIVE"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : (t.status || "").toUpperCase() === "USED"
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}>
                    {(t.status || "ACTIVE").toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
