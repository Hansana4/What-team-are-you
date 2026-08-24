# Security notes — hosting this quiz on a monashcoding.com subdomain

Goal: putting this quiz on, say, `quiz.monashcoding.com` (and embedding it in
Notion) must not create a path for anyone to attack `monashcoding.com` or its
users.

Two halves to that: **this codebase** (all of which is done, below) and **the
parent domain's configuration** (a short checklist for whoever owns DNS and the
main site — a static page cannot enforce those from its side).

---

## 1. What this page is

A fully static page. It has:

- **No backend, no API, no database.** The only thing sent anywhere is an
  anonymous, cookieless counter ping (`GET /e/<event>`, see the README) to the
  page's own origin; hosts without that endpoint serve a 404 and nothing else
  happens.
- **No user input.** Nothing is typed, uploaded, or submitted; the only
  interaction is clicking one of four fixed buttons per question.
- **No cookies, no `localStorage`, no `sessionStorage`, no service worker.** The
  score lives in a JS variable and dies with the tab, so there is nothing to
  steal and nothing that persists on the visitor's machine.
- **No third-party requests.** HTML, CSS, JS, the logo and the Figtree font are
  all served from this origin. Google Fonts was removed and the font
  self-hosted (`assets/fonts/`) precisely so no external host can ever ship
  code or track visitors here.
- **No dynamic code execution.** No `eval`, no `new Function`, no
  `setTimeout("string")`, no `innerHTML`/`outerHTML`/`insertAdjacentHTML`, no
  `document.write`. Every piece of text is set with `textContent` and every
  element with `createElement`, so quiz copy is inert data — even if someone
  edited a question to contain `<script>`, it would render as literal text.
- **No injectable URLs.** Both outbound links (Airtable form, Notion role page)
  are hard-coded constants in `quiz-data.js`. Nothing reads the query string or
  hash to build a URL, so there is no open-redirect or `javascript:` sink.
- **No `postMessage` listener** and no reading of the embedding page — the quiz
  never talks to whatever frames it.
- Outbound links use `target="_blank"` with `rel="noopener noreferrer"`, so an
  opened tab gets no `window.opener` handle back to this page.

Verify any of that at a glance:

```sh
grep -rniE "innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|new Function|fetch\(|XMLHttpRequest|localStorage|sessionStorage|addEventListener\(.message|document\.cookie" *.html *.js
grep -rniE "https?://" *.html *.css *.js      # only airtable.com + notion.site
```

## 2. Headers

`index.html` carries a strict Content-Security-Policy in a `<meta>` tag:
`default-src 'none'` with `'self'` for script/style/img/font only, plus
`connect-src 'none'`, `object-src 'none'`, `form-action 'none'` and
`base-uri 'none'`. Even a hostile edit to this repo would have a hard time
exfiltrating anything or loading remote code from this page.

`frame-ancestors`, HSTS, `Permissions-Policy` and friends **cannot** come from a
meta tag, so they live in [`_headers`](_headers) (Cloudflare Pages / Netlify
format). That file also restricts who may frame the page to monashcoding.com and
Notion, disables every browser permission, sends `Referrer-Policy: no-referrer`,
and sets `Origin-Agent-Cluster: ?1` (which, on top of `document.domain` already
being disabled in current browsers, blocks the legacy trick of a subdomain
relaxing its origin to join the parent domain).

`X-Frame-Options` is intentionally absent: it cannot express an allowlist, so it
would break the Notion embed. `frame-ancestors` is the modern equivalent and is
honoured by all current browsers.

**If you host on GitHub Pages**, custom headers are not supported — the meta CSP
still applies, but `frame-ancestors` and HSTS do not, meaning any site could
iframe the quiz. For a page with no login, no cookies and no state-changing
action, being framed is not a meaningful risk; if you want the headers anyway,
serve it through Cloudflare Pages (or any Cloudflare-proxied host) and the
`_headers` file takes effect as-is. On other hosts, translate `_headers` into
that host's config (`vercel.json` → `headers`, nginx `add_header`, Apache
`Header set`).

## 3. The part that isn't in this repo: subdomain trust

The browser's boundary is the **origin**, so `quiz.monashcoding.com` cannot read
`monashcoding.com`'s DOM, `localStorage`, `IndexedDB` or its responses. What
subdomains *do* share is **site** (eTLD+1), and that is where the real risk
lives — not in this page's code, but in what the main site chooses to trust.
Worth locking down while attaching the domain:

1. **Domain-wide cookies.** A cookie set with `Domain=.monashcoding.com` is
   readable by every subdomain. Set the main site's cookies host-only (omit the
   `Domain` attribute) and prefer the `__Host-` prefix, which browsers refuse to
   accept from another host. Then a compromised quiz host cannot read a session.
2. **Cookie tossing.** Any subdomain can *write* a cookie scoped to the parent
   domain, which can confuse or fixate sessions. `__Host-`prefixed cookies plus
   rejecting unrecognised cookie names on the server closes this.
3. **CORS.** Do not allowlist `*.monashcoding.com` (or reflect arbitrary
   `Origin`) on any monashcoding.com API. List exact origins that need access.
4. **`postMessage`.** Any handler on the main site should compare
   `event.origin` against an exact expected origin string, never
   `endsWith(".monashcoding.com")`.
5. **OAuth / SSO redirect URIs.** Keep wildcard subdomains out of redirect and
   post-logout allowlists.
6. **Subdomain takeover.** This is the likeliest real-world path: a DNS record
   for `quiz.monashcoding.com` pointing at a host that no longer serves it lets
   someone else claim that hostname and then run their own content on your
   domain. So: create the DNS record only after the host is provisioned, use
   GitHub's *verified domains* (or Cloudflare Pages custom domains) so nobody
   else can bind the name, and delete the DNS record the same day the site is
   retired. Audit dangling CNAMEs periodically.
7. **HSTS.** Serve HSTS on both the apex and the quiz host so no request
   downgrades to HTTP. Only add `preload` when every subdomain is HTTPS-only.
8. **Scope of trust.** Nothing on the main site should treat "is a
   monashcoding.com subdomain" as an authorisation signal.

None of these are caused by this quiz — they apply to any subdomain — but
attaching a new one is the right moment to check them.

## 4. Notion embed specifics

- Notion serves embeds in a sandboxed iframe. The quiz needs nothing from the
  parent frame, so the sandbox costs it nothing.
- Clicking Apply / Learn more tries a new tab first and only falls back to
  navigating the frame. Both targets are hard-coded constants, so the fallback
  cannot be pointed anywhere else.
- Embedding the quiz in a Notion page does **not** give the quiz any access to
  that Notion workspace, and does not give Notion any access to
  monashcoding.com.

## 5. Deployment checklist

- [ ] Serve over HTTPS only, with HSTS.
- [ ] Deploy with the `_headers` file (Cloudflare Pages / Netlify), or port it to
      the host's header config.
- [ ] Confirm headers landed: `curl -sI https://quiz.monashcoding.com | sort`.
- [ ] Confirm zero third-party requests: open DevTools → Network, reload, and
      check every row is same-origin.
- [ ] Confirm the CSP reports no violations in the console.
- [ ] Main site cookies are host-only / `__Host-` prefixed.
- [ ] No wildcard subdomain in CORS, `postMessage` checks, or OAuth redirects.
- [ ] DNS record created only after the host was provisioned, and the custom
      domain is verified with the host.
- [ ] Review this list again if the quiz ever gains a form, an API call, or
      anything that stores data — the guarantees above depend on it staying
      static.
