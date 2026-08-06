function mapEventList(e) {
  return {
    _id: e.id,
    title: e.title,
    description: e.description || "",
    image: e.flyerImage || "",
    category: e.categoryName || "",
    date: e.startDate,
    location: e.venue || "",
    price: e.minPrice != null ? Number(e.minPrice) : 0,
    ticketsAvailable: null,
    ticketsSold: e.ticketsSold || 0,
    slug: e.slug,
    type: e.type,
    status: e.status,
    organizerName: e.organizerName,
  };
}

function mapEventDetail(e) {
  const types = e.ticketTypes || [];
  const firstPaid = types.find((t) => !t.isFree) || types[0];
  const totalQty = types.reduce((s, t) => s + (t.quantity || 0), 0);
  const totalSold = types.reduce((s, t) => s + (t.ticketsSold || 0), 0);

  return {
    _id: e.id,
    title: e.title,
    description: e.description || "",
    image: e.flyerImage || "",
    category: e.category?.name || "",
    categoryId: e.category?.id || null,
    date: e.startDate,
    endDate: e.endDate || null,
    location: e.venue || "",
    latitude: e.latitude,
    longitude: e.longitude,
    price: firstPaid ? Number(firstPaid.price) : 0,
    ticketsAvailable: totalQty - totalSold,
    slug: e.slug,
    type: e.type,
    status: e.status,
    organizerName: e.organizerName,
    organizerId: e.organizerId,
    ticketTypes: types.map((t) => ({
      _id: t.id,
      name: t.name,
      description: t.description,
      price: Number(t.price),
      quantity: t.quantity,
      ticketsSold: t.ticketsSold,
      isFree: t.isFree,
      maxPerOrder: t.maxPerOrder,
    })),
    createdAt: e.createdAt,
    bankName: e.bankName || "",
    bankAccountNumber: e.bankAccountNumber || "",
    bankAccountName: e.bankAccountName || "",
  };
}

function toCreatePayload(form) {
  const startDate = form.date && form.time
    ? `${form.date}T${form.time}:00`
    : form.date
      ? `${form.date}T00:00:00`
      : null;

  const endDate = form.endDate && form.endTime
    ? `${form.endDate}T${form.endTime}:00`
    : form.endDate
      ? `${form.endDate}T23:59:00`
      : startDate;

  const ticketTypes = (form.ticketTypes || []).map((tt) => ({
    name: tt.name,
    description: tt.description || null,
    price: Number(tt.price) || 0,
    quantity: Number(tt.quantity) || 100,
    isFree: !tt.price || Number(tt.price) === 0,
    maxPerOrder: 10,
  }));

  return {
    title: form.title,
    description: form.description,
    flyerImage: form.image || null,
    categoryId: form.categoryId || null,
    type: form.type || "NORMAL",
    venue: form.location,
    startDate,
    endDate,
    ticketTypes,
    bankName: form.bankName || null,
    bankAccountNumber: form.bankAccountNumber || null,
    bankAccountName: form.bankAccountName || null,
  };
}

function toUpdatePayload(form) {
  const startDate = form.date && form.time
    ? `${form.date}T${form.time}:00`
    : form.date
      ? `${form.date}T00:00:00`
      : null;

  const endDate = form.endDate && form.endTime
    ? `${form.endDate}T${form.endTime}:00`
    : form.endDate
      ? `${form.endDate}T23:59:00`
      : startDate;

  return {
    title: form.title,
    description: form.description,
    flyerImage: form.image || null,
    categoryId: form.categoryId || null,
    venue: form.location,
    startDate,
    endDate,
    ticketTypes: (form.ticketTypes || []).map((tt) => ({
      name: tt.name,
      description: tt.description || null,
      price: Number(tt.price) || 0,
      quantity: Number(tt.quantity) || 100,
      isFree: !tt.price || Number(tt.price) === 0,
      maxPerOrder: tt.maxPerOrder || 10,
    })),
    bankName: form.bankName || null,
    bankAccountNumber: form.bankAccountNumber || null,
    bankAccountName: form.bankAccountName || null,
  };
}

export async function getEvents(params = {}) {
  const { default: api } = await import("./api");
  const { data } = await api.get("/events", { params });
  const list = Array.isArray(data) ? data : data.value || data.events || [];
  return { events: list.map(mapEventList), total: list.length };
}

export async function getMyEvents() {
  const { default: api } = await import("./api");
  const { data } = await api.get("/events/my-events");
  const list = Array.isArray(data) ? data : [];
  return list.map(mapEventList);
}

export async function getEventAnalytics(eventId) {
  const { default: api } = await import("./api");
  const { data } = await api.get(`/events/${eventId}/analytics`);
  return data || { months: [], totalRevenue: 0, totalTicketsSold: 0 };
}

export async function getEventBySlug(slug) {
  const { default: api } = await import("./api");
  const { data } = await api.get(`/events/${slug}`);
  return mapEventDetail(data);
}

export async function getEventById(id) {
  return getEventBySlug(id);
}

export async function createEvent(eventData) {
  const { default: api } = await import("./api");
  const { data } = await api.post("/events", toCreatePayload(eventData));
  return mapEventDetail(data);
}

export async function updateEvent(id, eventData) {
  const { default: api } = await import("./api");
  const { data } = await api.put(`/events/${id}`, toUpdatePayload(eventData));
  return mapEventDetail(data);
}

export async function deleteEvent(id) {
  const { default: api } = await import("./api");
  await api.delete(`/events/${id}`);
  return true;
}

export async function getCategories() {
  const { default: api } = await import("./api");
  const { data } = await api.get("/categories");
  const list = Array.isArray(data) ? data : [];
  return list.map((c) => ({ _id: c.id, name: c.name, slug: c.slug }));
}
