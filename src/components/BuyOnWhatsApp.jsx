import { FaWhatsapp } from "react-icons/fa";

/**
 * Sends the buyer into the WhatsApp purchase flow with the keyword prefilled, so
 * they only have to press send.
 *
 * The keyword must match the "Event Tickets — Buy" flow trigger in WACRM
 * (`ticket` / `tickets`, contains-matching). Changing it here without changing it
 * there leaves the buyer talking to the AI fallback flow instead.
 *
 * Renders nothing when VITE_WHATSAPP_NUMBER is unset — better a missing button
 * than one that opens a chat to nobody. Note Vite inlines env vars at build time,
 * so setting the variable requires a redeploy, not just a reload.
 */
export default function BuyOnWhatsApp({ eventTitle, className = "" }) {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (!number) return null;

  // wa.me needs international format with no +, spaces or dashes. A local
  // 0803... number silently fails to open a chat, which is the usual reason
  // these links appear to do nothing.
  const digits = String(number).replace(/\D/g, "");

  // The title is passed so the flow can narrow straight to this event: it forwards
  // the inbound message to list_events as `search`, which strips the keyword and
  // searches the rest.
  //
  // Quotes, backslashes and newlines are removed first. WACRM builds the outbound
  // request body by raw string substitution into a JSON template with no escaping
  // (interpolateVars in engine.ts), so any of those characters would produce a
  // malformed body and the buyer would see a generic failure. Stripping them here
  // guarantees the link we generate is always safe; a buyer free-typing quotes
  // carries the same pre-existing risk as every other flow.
  const safeTitle = String(eventTitle ?? "")
    .replace(/["\\\r\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);

  const message = safeTitle ? `ticket - ${safeTitle}` : "ticket";
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`mt-3 w-full flex items-center justify-center gap-2 border border-green-500 text-green-600 dark:text-green-400 py-3 rounded-lg font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition cursor-pointer ${className}`}
    >
      <FaWhatsapp className="text-lg" />
      Buy on WhatsApp
    </a>
  );
}
