import assert from "node:assert/strict";
import test from "node:test";
import { app } from "./server.js";

async function withServer(run) {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));

  try {
    const address = server.address();
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test("health endpoint confirms the backend is running", async () => {
  await withServer(async (origin) => {
    const response = await fetch(`${origin}/api/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.match(body.message, /backend is working/i);
  });
});

test("test enquiry validates input and stores nothing", async () => {
  await withServer(async (origin) => {
    const response = await fetch(`${origin}/api/test-enquiry`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Zakir", email: "test@example.com" })
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.match(body.message, /nothing was stored or sent/i);
  });
});
