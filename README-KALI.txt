NEON//BDAY — MATRIX BIRTHDAY STUDIO
===================================
A reusable cyberpunk / Matrix-inspired birthday microsite.

FEATURES
- Animated Matrix-style falling characters (visual effect only; no commands run).
- Terminal-style intro sequence.
- Neon themes: Matrix green, Cyberpunk pink, Ice blue, Gold glitch.
- Optional recipient name, sender signature, date and message.
- Multiple local file previews and a public media URL gallery.
- Share-link generator, QR code download and WhatsApp sharing.
- Responsive layout for mobile and desktop.
- No login, password, OTP, payment, camera, microphone or contact collection.

RUN LOCALLY
1. Open a terminal in this folder.
2. Run: python3 -m http.server 8000
3. Visit: http://127.0.0.1:8000

PUBLISH ON GITHUB PAGES
1. Open repository Settings -> Pages.
2. Source: Deploy from a branch.
3. Branch: main ; Folder: /(root) ; Save.
4. Wait for the Pages deployment to finish successfully in Actions.
5. Open: https://lisophia927-dev.github.io/birthday-surprise/
6. Paste that public address into PUBLISHED WEBSITE URL, then build the share link and QR.

MEDIA SHARING LIMITATION
Files selected in MEMORY VAULT are local previews only. A QR code/link cannot carry large photo or video files. To share media, upload each file to a public HTTPS host you control, then paste its public URL into PUBLIC MEDIA URLS, one URL per line. Ensure the host permits public access. The QR/link includes greeting text and public media URLs, not local files. The QR library loads from a CDN and needs internet access.

SAFETY
The Matrix rain and terminal are visual effects only. This page does not execute Kali/Linux commands, scan devices, exploit anything, or collect visitor data. Never ask recipients for passwords, OTPs, card details, APK installs or permissions.
