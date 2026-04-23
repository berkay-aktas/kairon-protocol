export function createSession(userId) {
  if (typeof userId !== "string" || userId.length === 0) {
    throw new Error("userId required");
  }
  return { userId, issuedAt: Date.now() };
}

export function validateSession(session) {
  if (!session || typeof session !== "object") return false;
  if (typeof session.userId !== "string" || session.userId.length === 0) return false;
  return true;
}
