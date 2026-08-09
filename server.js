import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const app = express();

const currentFile = fileURLToPath(import.meta.url);
const rootDirectory = path.dirname(currentFile);

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    service: "Zakir's sales-page backend",
    message: "The Render backend is working.",
    checkedAt: new Date().toISOString()
  });
});

app.post("/api/test-enquiry", (request, response) => {
  const name = typeof request.body?.name === "string" ? request.body.name.trim() : "";
  const email = typeof request.body?.email === "string" ? request.body.email.trim() : "";

  if (!name || name.length > 80 || !email || email.length > 160 || !email.includes("@")) {
    return response.status(400).json({
      ok: false,
      message: "Enter a short name and a valid test email address."
    });
  }

  return response.status(200).json({
    ok: true,
    message: `Backend received the test for ${name}. Nothing was stored or sent.`,
    reference: `test-${Date.now()}`
  });
});

app.get("/backend-test", (_request, response) => {
  response.sendFile(path.join(rootDirectory, "backend-test.html"));
});

app.use(express.static(rootDirectory, { index: "index.html" }));

app.use((_request, response) => {
  response.status(404).json({ ok: false, message: "Page not found." });
});

const isEntryPoint = process.argv[1] && path.resolve(process.argv[1]) === currentFile;

if (isEntryPoint) {
  const port = Number(process.env.PORT || 3000);
  app.listen(port, "0.0.0.0", () => {
    console.log(`Sales-page backend listening on port ${port}`);
  });
}
