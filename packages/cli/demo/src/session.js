export function toCookie(session, { name = "sid", maxAge = 60 * 60 * 24 } = {}) {
  if (!session || typeof session.userId !== "string") {
    throw new Error("invalid session");
  }
  const value = `${session.userId}.${session.issuedAt}`;
  return `${name}=${value}; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`;
}

export function fromCookieValue(value) {
  const [userId, issuedAtStr] = String(value).split(".");
  const issuedAt = Number(issuedAtStr);
  if (!userId || Number.isNaN(issuedAt)) return null;
  return { userId, issuedAt };
}
