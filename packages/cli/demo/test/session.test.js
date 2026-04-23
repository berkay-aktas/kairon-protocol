import { test } from "node:test";
import assert from "node:assert/strict";
import { createSession } from "../src/auth.js";
import { toCookie, fromCookieValue } from "../src/session.js";

test("toCookie emits HttpOnly SameSite=Lax cookie", () => {
  const s = createSession("user-42");
  const cookie = toCookie(s);
  assert.match(cookie, /^sid=user-42\.\d+/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Lax/);
});

test("fromCookieValue roundtrips a session value", () => {
  const s = createSession("user-42");
  const cookie = toCookie(s);
  const value = cookie.split("=")[1].split(";")[0];
  const restored = fromCookieValue(value);
  assert.equal(restored.userId, "user-42");
  assert.equal(restored.issuedAt, s.issuedAt);
});

test("fromCookieValue returns null on malformed input", () => {
  assert.equal(fromCookieValue(""), null);
  assert.equal(fromCookieValue("nope"), null);
});
