import { test } from "node:test";
import assert from "node:assert/strict";
import { createSession, validateSession } from "../src/auth.js";

test("createSession issues a session with userId and timestamp", () => {
  const s = createSession("user-1");
  assert.equal(s.userId, "user-1");
  assert.equal(typeof s.issuedAt, "number");
});

test("createSession rejects empty userId", () => {
  assert.throws(() => createSession(""), /userId required/);
  assert.throws(() => createSession(null), /userId required/);
});

test("validateSession accepts real sessions and rejects junk", () => {
  assert.equal(validateSession(createSession("user-1")), true);
  assert.equal(validateSession(null), false);
  assert.equal(validateSession({}), false);
  assert.equal(validateSession({ userId: "" }), false);
});
