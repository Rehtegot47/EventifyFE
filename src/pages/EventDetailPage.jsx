import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiCalendar, FiMapPin, FiClock } from "react-icons/fi";
import { getEventBySlug } from "../services/eventService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

function GoogleMapEmbed({ location }) {
  const query = encodeURIComponent(location);
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <iframe
        title="Event location"
        src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${query}&zoom=14`}
        className="w-full h-56"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export default function EventDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    getEventBySlug(slug)
      .then((evt) => {
        setEvent(evt);
        const types = evt.ticketTypes || [];
        if (types.length > 0) setSelectedType(types[0]);
      })
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner size="lg" className="py-20" />;
  if (!event)
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">
        <p className="text-lg">Event not found.</p>
        <Link to="/events" className="text-eventify-600 underline mt-2 inline-block">
          Browse events
        </Link>
      </div>
    );

  const date = new Date(event.date);
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const ticketPrice = selectedType ? selectedType.price : event.price;
  const maxAvailable = selectedType
    ? (selectedType.quantity - selectedType.ticketsSold)
    : event.ticketsAvailable;

  const handleBuy = () => {
    if (!user) return navigate("/login");
    navigate(`/checkout/${event.slug}?qty=${qty}&type=${selectedType?._id || ""}&eventId=${event._id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden">
        <img
          src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <span className="text-sm font-semibold text-eventify-600 dark:text-eventify-400 bg-eventify-50 dark:bg-eventify-900/30 px-3 py-1 rounded-full">
            {event.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{event.title}</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">{event.description}</p>

          <div className="mt-6 flex flex-col gap-3 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-eventify-500" />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="text-eventify-500" />
              <span>{timeStr}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <FiMapPin className="text-eventify-500" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {event.location && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
              <GoogleMapEmbed location={event.location} />
            </div>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 h-fit sticky top-24">
          <p className="text-3xl font-bold text-eventify-600 dark:text-eventify-400">
            {ticketPrice > 0 ? `\u20A6${ticketPrice.toFixed(2)}` : "Free"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">per ticket</p>

          {(event.ticketTypes || []).length > 1 && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ticket Type</label>
              <div className="flex flex-col gap-2 mt-1">
                {event.ticketTypes.map((tt) => (
                  <button
                    key={tt._id}
                    onClick={() => setSelectedType(tt)}
                    disabled={tt.quantity - tt.ticketsSold <= 0}
                    className={`text-left px-3 py-2 rounded-lg border text-sm transition cursor-pointer ${
                      selectedType?._id === tt._id
                        ? "border-eventify-500 bg-eventify-50 dark:bg-eventify-900/30"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                    } ${tt.quantity - tt.ticketsSold <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{tt.name}</span>
                    <span className="ml-2 text-eventify-600 dark:text-eventify-400 font-semibold">
                      {tt.price > 0 ? `\u20A6${tt.price.toFixed(2)}` : "Free"}
                    </span>
                    {tt.quantity - tt.ticketsSold <= 0 && (
                      <span className="ml-2 text-red-500 text-xs">Sold out</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedType && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
              <div className="flex items-center gap-3 mt-1">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-8 text-center text-gray-900 dark:text-white">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(maxAvailable || 10, qty + 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {maxAvailable != null && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {maxAvailable} tickets available
            </p>
          )}

          <button
            onClick={handleBuy}
            disabled={!selectedType || (maxAvailable != null && maxAvailable <= 0)}
            className="mt-4 w-full bg-eventify-500 text-white py-3 rounded-lg font-semibold hover:bg-eventify-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {maxAvailable != null && maxAvailable <= 0
              ? "Sold Out"
              : `Get Tickets \u2014 \u20A6${(ticketPrice * qty).toFixed(2)}`}
          </button>

          {(event.bankName || event.bankAccountNumber || event.bankAccountName) && (
            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Bank Transfer</p>
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-sm space-y-1">
                {event.bankName && (
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span className="text-gray-500 dark:text-gray-400">Bank</span>
                    <span className="font-medium">{event.bankName}</span>
                  </div>
                )}
                {event.bankAccountNumber && (
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span className="text-gray-500 dark:text-gray-400">Account</span>
                    <span className="font-medium font-mono">{event.bankAccountNumber}</span>
                  </div>
                )}
                {event.bankAccountName && (
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span className="text-gray-500 dark:text-gray-400">Name</span>
                    <span className="font-medium">{event.bankAccountName}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
