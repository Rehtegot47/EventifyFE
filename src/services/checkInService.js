export async function scanTicket(qrCode) {
  const { default: api } = await import("./api");
  const { data } = await api.post("/check-in/scan", null, {
    params: { qrCode },
  });
  return data;
}
