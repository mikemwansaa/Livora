# Livora Dental Clinic — website

Static site (HTML, CSS, one small JS file). No framework, no database, no server code, no third-party scripts, fonts or trackers.

## Deploy on Vercel (free)
1. Put this folder in a GitHub repository (the `vercel.json` file must be at the root).
2. In Vercel: Add New > Project > import the repository. Framework preset: **Other**. No build command, no output directory.
3. Deploy. Vercel applies the security headers in `vercel.json` automatically.
4. Check the result at https://securityheaders.com and https://observatory.mozilla.org (aim for A or A+).

(Netlify or Cloudflare Pages: use the `_headers` file instead.)

## Why it is hard to hack
- Nothing to break into: there is no server, login, database or admin panel. Visitors only download static files.
- Strict Content Security Policy: only files from this site can load. Injected scripts, remote code, framing and form hijacking are blocked.
- HTTPS enforced with HSTS, clickjacking blocked (`frame-ancestors 'none'`), MIME sniffing off, camera, microphone and location disabled.
- Fonts are self-hosted, so visitors' browsers never contact Google or any other third party.
- The appointment form is validated, cleaned of control characters and sent through the visitor's own email app. No form data is stored or transmitted by the site.
- The script never uses `eval` or `innerHTML`, and makes no network requests.
- External links use `rel="noopener noreferrer"`. `/.well-known/security.txt` tells researchers where to report problems.

Keep it that way: turn on two-factor authentication for the GitHub and Vercel accounts, and for the email mailbox and domain registrar. Those are the real attack surface for a static site.

## Before launch
- Replace `assets/img/og.jpg` reference in `index.html` with the full address once the domain is known (e.g. https://yourdomain.com/assets/img/og.jpg) so WhatsApp and Facebook previews work.
- Confirm the ZRA tax clearance certificate is still valid (the site says the clinic holds one).
- Replace the photos with the clinic's own team and rooms when available (the profile's photos are cropped from marketing images).
- The profile's second email (a Yahoo address) and the "ultracarezambia" website and email were deliberately left off the site.
