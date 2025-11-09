const express = require("express");
const path = require("path");
const QRCode = require("qrcode");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/qrcode", async (req, res) => {
  try {
    const token = Date.now().toString();
    const host = req.get("host");
    const protocol = req.protocol;
    const scanUrl = `${protocol}://${host}/scan?token=${token}`;


    const dataUrl = await QRCode.toDataURL(scanUrl, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 1,
      width: 300,
    });

    res.json({ dataUrl, token, scanUrl });
  } catch (err) {
    console.error("Failed to generate QR", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/scan", (req, res) => {
  const tokenRaw = req.query.token;
  const token = Number(tokenRaw);
  if (!token || Number.isNaN(token)) {
    return res.redirect("https://www.youtube.com");
  }
  const ageMs = Date.now() - token;
  if (ageMs <= 30_000) {
    return res.redirect("https://www.google.com");
  } else {
    return res.redirect("https://www.youtube.com");
  }
});

app.listen(PORT, () => {
  console.log(`Dynamic QR server listening: http://localhost:${PORT}`);
});
