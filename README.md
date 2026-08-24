# What team are you?

A static remake of the MAC "What team are you?" quiz: 10 questions, one point per
answer to the linked team, and the highest-scoring team is shown with an
**Apply for MAC!** button and a role-specific **Learn more** button.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page shell |
| `styles.css` | Yellow `#fee42f` / blue `#2563eb` styling, plus embed + short-viewport layouts |
| `quiz-data.js` | Questions, answers, answer → team mapping, team copy and links |
| `quiz.js` | Quiz flow, scoring and rendering |
| `assets/mac_logo.png` | Logo shown on the result screen |
| `assets/fonts/` | Self-hosted Figtree (no third-party font requests) |
| `_headers` | Security headers for Cloudflare Pages / Netlify |
| `SECURITY.md` | Hosting the quiz on a monashcoding.com subdomain safely |

Open `index.html` directly, or serve the folder (`python3 -m http.server`).

## Embedding in Notion

1. Host the folder over **HTTPS** — GitHub Pages works well (Settings → Pages →
   deploy from `main` / root). Notion will not load an `http://` or `file://` page.
2. In Notion type `/embed`, paste the page URL, and press Enter.
3. Drag the bottom edge of the block to size it. Around **700 × 560** or larger
   shows the quiz comfortably; it stays usable down to roughly 400 × 380.

The page detects that it is inside an iframe and adapts automatically:

- Compact padding, type and button sizes, so the card fits the block height
  Notion gives it (Notion cannot auto-resize an embed to its content).
- Extra tightening at short heights, and a single column of answers on narrow
  blocks.
- Scrolling stays inside the frame instead of scrolling the Notion page.
- Apply / Learn more links open in a new tab, with a fallback that breaks out of
  the frame if the embed host blocks popups.
- The card stays light even when Notion is in dark mode.

Append `?embed=1` to the URL to force the embedded layout when testing outside an
iframe. Non-embedded visits keep the full-size layout.

## Security

The page is static, stores nothing, sends nothing, loads no third-party
resources, and builds every element with `textContent`/`createElement` — so
there is no injection sink and nothing to exfiltrate. It ships a strict
Content-Security-Policy in `index.html` and the rest of the header set in
`_headers`. Before attaching a `monashcoding.com` subdomain, read
[SECURITY.md](SECURITY.md) — it covers the subdomain-trust items that have to be
set on the parent domain (host-only cookies, no wildcard CORS, DNS/takeover
hygiene) and has a deployment checklist.

## Editing the quiz

All content lives in `quiz-data.js`:

- `APPLY_URL` — the shared Airtable application form.
- `OUTCOMES` — each team's displayed title, description, and Learn more link.
- `OUTCOME_ORDER` — team priority used to break score ties.
- `QUESTIONS` — question text plus four answers, each naming an `outcome` key.

Every team is currently linked to exactly four answers, matching the original
quiz's maximum score of 4.
