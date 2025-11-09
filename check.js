const express = require("express");
const fs = require("fs");
const app = express();

app.get("/track", (req, res) => {
  const num = parseInt(req.query.num, 10) || null;
  const ts = parseInt(req.query.ts, 10); // timestamp (ms) that was embedded in the QR
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const loggedAt = new Date().toISOString();

  fs.appendFileSync(
    "logs.txt",
    `${loggedAt} - num=${num} - ts=${ts} - IP=${ip}\n`
  );
  console.log(
    "Logged visit:",
    `${loggedAt} - num=${num} - ts=${ts} - IP=${ip}`
  );

  const now = Date.now();
  const within30s = !isNaN(ts) && now <= ts + 30000;

  const link1 = "https://google.com";
  const link2 = "https://youtube.com";

  const redirectURL = within30s ? link1 : link2;
  res.redirect(redirectURL);
});

// New endpoint to generate QR code URL
app.get("/generate-qr", (req, res) => {
  const now = new Date();
  const nowStr = now.toLocaleString();
  const ts = now.getTime();
  const url = `https://wuang-qr-code-gen.vercel.app/check.html?ts=${ts}&time=${encodeURIComponent(
    nowStr
  )}`;

  res.json({ qrUrl: url });
});

app.listen(3000, () => {
  console.log("QR tracking server running on http://localhost:3000");
});
