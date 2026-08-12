# Knotes Central

Notes, lab manuals and previous-year question papers for RVCE — every
department, year and semester in one place.

**Contribute:** [add notes in about a minute](https://github.com/Developer1010x/knotesneo/issues/new?template=add-notes.yml)
· [report a broken link](https://github.com/Developer1010x/knotesneo/issues/new?template=broken-link.yml)
· [CONTRIBUTING.md](CONTRIBUTING.md)

## What it does

- **Browse** by department → year → semester → subject, with note counts and
  coverage badges at every level, so you can see what exists before you click.
- **Search** subjects by name, code or note title — from the search page, or
  with <kbd>⌘K</kbd> / <kbd>Ctrl</kbd>+<kbd>K</kbd> anywhere on the site.
- **Filter** by material type: theory notes, lab material, question papers.
- **Know where a link goes** before opening it — Drive (RVCE login) vs GitHub.
- **Set your semester once** and land on your own subjects every visit.
- **Save notes and tick off subjects** — bookmarks and revision progress, stored
  on your device, no account.
- **Exam prep view** — a whole semester's material in one list, grouped by type.
- **Installable** on Android/iOS, with offline browsing of pages you have seen.
- **What's new** feed (plus [RSS](/feed.xml)), dated automatically from git
  history.
- Light and dark themes, mobile-first layout, and every page prerendered as
  static HTML.

Most material lives in RVCE Workspace Drive, so you will usually need to be
signed in with your college account.

## How the catalog works

The catalog is plain TypeScript data, not a database — one file per department:

```
src/data/departments/<slug>.ts   one Department each, registered in index.ts
src/data/contributors.ts         the contributors page
src/data/types.ts                the shape everything must match
```

Adding notes means adding an object to a `subjects` array. Anyone can do it
through the GitHub editor; see [CONTRIBUTING.md](CONTRIBUTING.md).

## Running it

```bash
npm install
npm run dev         # http://localhost:3000
npm run check:data  # validate the catalog
npm run typecheck
npm run lint
npm run build
```

CI runs all four on every pull request.

Next.js App Router + Tailwind. Colours are CSS custom properties in
`src/app/globals.css` surfaced as semantic Tailwind names (`bg-surface`,
`text-muted`, `text-brand`), so both themes stay consistent.

## Credits

- [Developer1010x](https://developer1010x.github.io/PORTFOLIO/) — V1 and the idea (S Prajwall N)
- [KTS-o7](https://kts-o7.github.io) — refactoring and updates (Krishna Tejaswi)
- Everyone on the [contributors page](https://knotescentral.github.io/contributors)

Previous versions:
[V1](https://knotes-central-v3.github.io/KnotesCentralV1/) ·
[V2](https://knotes-central-v3.github.io/KnotesCentralV2/)
