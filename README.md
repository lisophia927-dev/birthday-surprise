# Neon Matrix Birthday Studio

A cyberpunk-inspired, shareable birthday microsite with customizable greetings, themes, a QR code generator, and optional public media links.

## Run locally

Open a terminal in the project folder and run:

```bash
python3 -m http.server 8000
```

Then visit <http://127.0.0.1:8000>.

## Publish with GitHub Pages

1. In this repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/(root)`, then click **Save**.
4. Wait for the Pages deployment to finish successfully in **Actions**.
5. Open the published site: <https://lisophia927-dev.github.io/birthday-surprise/>.
6. Paste that URL in the **Published website URL** field to build a share link and QR code.

## Media sharing

Files selected in the Memory Vault are local previews only and are not included in the share link. To share media, upload files to a public HTTPS host you control and paste their public URLs, one per line, into **Public media URLs**. Do not include private or sensitive files.

The greeting text and media URLs are encoded in the share link. The QR-code library is loaded from a CDN, so generating QR codes requires an internet connection.

## Privacy and safety

The Matrix animation is decorative. This site does not execute terminal commands, scan devices, or ask for login credentials, OTPs, payment details, camera or microphone access, or contacts.
