import { useState } from "react";
import { FiCalendar, FiMapPin, FiClock, FiX, FiTag } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";

const statusConfig = {
  ACTIVE: {
    label: "Upcoming",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800",
  },
  USED: {
    label: "Used",
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-500 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700",
  },
  CANCELLED: {
    label: "Cancelled",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-800",
  },
};

export default function TicketCard({ ticket }) {
  const [showQr, setShowQr] = useState(false);
  const status = (ticket.status || "ACTIVE").toUpperCase();
  const cfg = statusConfig[status] || statusConfig.ACTIVE;

  const date = ticket.eventDate
    ? new Date(ticket.eventDate).toLocaleDateString("en-NG", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const time = ticket.eventDate
    ? new Date(ticket.eventDate).toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const price = ticket.totalAmount ?? ticket.price ?? 0;
  const qrValue = ticket.qrCode || ticket._id || "";

  return (
    <>
      <div className="group relative bg-white dark:bg-gray-800 rounded-2xl ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Left stub */}
          <div className="sm:w-36 h-28 sm:h-auto bg-gradient-to-br from-emerald-500 to-emerald-600 flex flex-col items-center justify-center text-white relative shrink-0">
            <FiTag className="text-2xl mb-1 opacity-80" />
            <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">Eventify</span>
          </div>

          {/* Perforated edge (desktop) */}
          <div className="hidden sm:block absolute left-36 top-0 bottom-0 w-0">
            <div className="h-full border-l-2 border-dashed border-gray-200 dark:border-gray-600" />
          </div>

          {/* Right body */}
          <div className="flex-1 p-4 sm:pl-5 flex flex-col justify-between min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white truncate text-base">
                  {ticket.eventTitle || "Event"}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  {date && (
                    <span className="flex items-center gap-1">
                      <FiCalendar className="shrink-0" /> {date}
                    </span>
                  )}
                  {time && (
                    <span className="flex items-center gap-1">
                      <FiClock className="shrink-0" /> {time}
                    </span>
                  )}
                  {ticket.eventLocation && (
                    <span className="flex items-center gap-1 min-w-0">
                      <FiMapPin className="shrink-0" /> <span className="truncate">{ticket.eventLocation}</span>
                    </span>
                  )}
                </div>
              </div>
              <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>

            <div className="mt-3 flex items-end justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">Qty:</span> {ticket.quantity}
                {ticket.ticketType && ticket.ticketType !== "General" && (
                  <span className="ml-2 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-medium">
                    {ticket.ticketType}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {"\u20A6"}{price.toFixed(2)}
                </span>
                {status === "ACTIVE" && qrValue && (
                  <button
                    onClick={() => setShowQr(true)}
                    className="px-4 py-1.5 text-xs font-semibold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 active:bg-emerald-700 transition cursor-pointer"
                  >
                    Show QR
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQr && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowQr(false)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-xs w-full text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{ticket.eventTitle}</h3>
              <button onClick={() => setShowQr(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer">
                <FiX className="text-lg" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Scan this at the entrance</p>

            <div className="bg-white rounded-xl p-4 inline-block ring-1 ring-gray-100 dark:ring-gray-700">
              <QRCodeSVG value={qrValue} size={180} level="M" includeMargin={false} />
            </div>

            <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">Ticket ID: {qrValue.slice(0, 8)}</p>
            <button
              onClick={() => setShowQr(false)}
              className="mt-4 w-full py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
