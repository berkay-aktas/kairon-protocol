import { test } from "node:test";
import assert from "node:assert/strict";
import { createSession, validateSession } from "../src/auth.js";
import { toCookie, fromCookieValue } from "../src/session.js";

test("end-to-end: create, encode, decode, validate", () => {
  const s = createSession("user-smoke");
  const cookie = toCookie(s);
  const value = cookie.split("=")[1].split(";")[0];
  const restored = fromCookieValue(value);
  assert.ok(restored);
  assert.equal(validateSession(restored), true);
});
