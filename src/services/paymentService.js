export async function initiateOrder(orderData) {
  const { default: api } = await import("./api");
  const { data } = await api.post("/orders/initialize", orderData);
  return data;
}

export async function verifyOrder(reference) {
  const { default: api } = await import("./api");
  const { data } = await api.get("/orders/verify", { params: { reference } });
  return data;
}

export async function getUserOrders() {
  const { default: api } = await import("./api");
  const { data } = await api.get("/orders");
  return Array.isArray(data) ? data : [];
}
