import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiMapPin, FiTag } from "react-icons/fi";

export default function EventCard({ event }) {
  const date = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const time = event.date
    ? new Date(event.date).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  const isLive = event.status === "PUBLISHED" || !event.status;

  return (
    <Link
      to={`/events/${event.slug || event._id}`}
      className="block transition cursor-pointer"
    >
      <div className="group w-full overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-eventify-200/60 dark:border-eventify-800/40">
        <div className="h-[3px] w-full bg-gradient-to-r from-eventify-500 to-eventify-700"></div>

        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80"}
            alt={event.title}
            className="transition-transform duration-500 group-hover:scale-105"
            style={{ position: "absolute", height: "100%", width: "100%", inset: 0, objectFit: "cover" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"></div>
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {event.category || "Event"}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <h2 className="line-clamp-2 text-lg font-bold leading-tight text-white drop-shadow">
              {event.title}
            </h2>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-eventify-100 text-eventify-800 dark:bg-eventify-900/40 dark:text-eventify-300">
              <FiTag className="h-3.5 w-3.5" />
              Ticket Event
            </span>
            {isLive && (
              <span className="rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Live
              </span>
            )}
          </div>

          {event.description && (
            <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed" style={{ minHeight: "2lh" }}>
              {event.description}
            </p>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <FiCalendar className="h-4 w-4 shrink-0 text-eventify-500" />
              <span>{date}</span>
            </div>
            {time && (
              <div className="flex items-center gap-2">
                <FiClock className="h-4 w-4 shrink-0 text-eventify-500" />
                <span>{time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2">
                <FiMapPin className="h-4 w-4 shrink-0 text-eventify-500" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
