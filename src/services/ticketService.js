function getStoredUser() {
  try {
    const raw = localStorage.getItem("eventify_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function mapTicket(t) {
  return {
    _id: t.id || t._id,
    id: t.id,
    eventId: t.eventId,
    eventTitle: t.eventTitle || "Event",
    eventDate: t.eventDate || "",
    eventLocation: t.eventLocation || "",
    ticketType: t.ticketType || "General",
    price: t.price ?? 0,
    quantity: t.quantity || 1,
    totalAmount: t.totalAmount ?? t.price ?? 0,
    status: (t.status || "ACTIVE").toUpperCase(),
    qrCode: t.qrCode || "",
    purchasedAt: t.purchasedAt || "",
  };
}

export async function getUserTickets() {
  const { default: api } = await import("./api");
  const user = getStoredUser();
  const email = user?.email;
  if (!email) return [];
  const { data } = await api.get("/tickets/my-tickets", { params: { email } });
  const tickets = Array.isArray(data) ? data : data?.content || [];
  return tickets.map(mapTicket);
}
