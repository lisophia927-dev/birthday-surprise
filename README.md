# NEON_BDAY_v3_WITH_HAPPY_BIRTHDAY_SONG

A Matrix-inspired birthday page with customizable greetings, share links and QR codes, fireworks, and a browser-synthesized Happy Birthday melody.

## Run locally

From the folder containing `index.html`, run:

```bash
python3 -m http.server 8000
```

Then open <http://127.0.0.1:8000>.

## GitHub Pages

Repository: <https://github.com/lisophia927-dev/birthday-surprise>

1. Open **Settings → Pages**.
2. Select **Deploy from a branch**, branch `main`, folder `/(root)`, and save.
3. Wait for the Pages deployment to succeed in **Actions**.
4. Visit <https://lisophia927-dev.github.io/birthday-surprise/>.

## Song and media

The birthday melody is synthesized in the browser after the visitor clicks a sound button; this avoids a missing MP3 dependency and does not bundle a third-party recording. Selected media files are local only. To share them, host them publicly over HTTPS and add their URLs to the media field. Avoid sharing private files.
