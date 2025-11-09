# Dynamic QR (30s token) — demo project

This small project demonstrates a dynamic QR system where the server issues QR images that encode a time-stamped token (Date.now()).

Features

- `GET /qrcode` — returns a JSON payload with a `dataUrl`, `token`, and `scanUrl`. The `dataUrl` is a PNG Data URL of a QR code which encodes the `scanUrl` (i.e. `/scan?token=TIMESTAMP`).
- `GET /scan?token=TIMESTAMP` — redirects to `https://www.google.com` if scanned within 30 seconds of issuance, otherwise redirects to `https://www.youtube.com`.
- Static client at `public/index.html` shows the QR, a countdown, and a progress bar. The client preloads next QR and swaps smoothly.

How to run

1. Install deps

```powershell
cd dynamic-qr
npm install
```

2. Start server

```powershell
npm start
```

3. Open `http://localhost:3000/` in your browser. The page displays a QR code which points to `/scan?token=...` on the same server. Scanning or visiting that link will redirect based on token age.

Notes and testing

- QR codes are valid for 30 seconds. The client will refresh and preload the next QR automatically for a smooth experience.
- If you want a longer/shorter validity window, change the `VALIDITY_MS` constant in `public/index.html`'s script and the server check (in `server.js`) accordingly.

Security

- This is a demo project. Token values are simple timestamps and not cryptographically secure. For production use, sign tokens and validate signatures.
