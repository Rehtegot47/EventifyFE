export async function getDiscountCodes(eventId) {
  const { default: api } = await import("./api");
  const { data } = await api.get(`/events/${eventId}/discounts`);
  return Array.isArray(data) ? data : [];
}

export async function createDiscountCode(eventId, codeData) {
  const { default: api } = await import("./api");
  const { data } = await api.post(`/events/${eventId}/discounts`, {
    code: codeData.code,
    type: (codeData.type || "PERCENTAGE").toUpperCase(),
    value: Number(codeData.value),
    maxUsage: Number(codeData.maxUsage) || 0,
    minPurchaseAmount: codeData.minPurchaseAmount ? Number(codeData.minPurchaseAmount) : null,
    expiresAt: codeData.expiresAt || null,
  });
  return data;
}

export async function deleteDiscountCode(eventId, discountId) {
  const { default: api } = await import("./api");
  await api.delete(`/events/${eventId}/discounts/${discountId}`);
  return true;
}

export async function generateReferral(eventId) {
  const { default: api } = await import("./api");
  const { data } = await api.post("/referrals/generate", { eventId });
  return data;
}

export async function getMyReferrals() {
  const { default: api } = await import("./api");
  const { data } = await api.get("/referrals");
  return Array.isArray(data) ? data : [];
}
