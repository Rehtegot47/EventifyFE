function mapUser(u) {
  if (!u) return null;
  return {
    _id: u.id,
    name: u.fullName,
    email: u.email,
    role: u.role ? u.role.toLowerCase() : "attendee",
    avatar: u.avatarUrl || "",
    phone: u.phone || "",
  };
}

export async function loginUser(email, password) {
  const { default: api } = await import("./api");
  const { data } = await api.post("/auth/login", { email, password });
  return { token: data.token, user: mapUser(data.user) };
}

export async function registerUser(userData) {
  const { default: api } = await import("./api");
  const { data } = await api.post("/auth/register", {
    fullName: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || "ATTENDEE",
  });
  return { token: data.token, user: mapUser(data.user) };
}

export async function getCurrentUser() {
  const { default: api } = await import("./api");
  const { data } = await api.get("/auth/me");
  return mapUser(data);
}
