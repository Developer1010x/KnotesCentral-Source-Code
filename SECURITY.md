# Security Policy

## What is in scope

KnotesNeo is a static site. It has no backend, no database and no accounts, so
there is nothing to log into and nothing of yours stored on a server —
bookmarks, revision progress and your saved semester live in your own browser's
`localStorage` and never leave the device.

That leaves a small but real surface, and reports about any of it are welcome:

- **The site itself** — the deployed build, its service worker, or a
  cross-site-scripting hole in how catalog data is rendered.
- **The build pipeline** — the GitHub Actions workflows in `.github/workflows/`
  and the Node scripts in `scripts/`.
- **The catalog** — a link in `src/data/departments/` that points somewhere
  malicious, or material that should not be shared publicly.

| Version | Supported |
| ------- | --------- |
| KnotesNeo (this repository, `main`) | :white_check_mark: |
| V2 and V1 (archived, unmaintained)  | :x: |

The archived versions are static HTML kept for history at
[V2](https://knotes-central-v3.github.io/KnotesCentralV2/) and
[V1](https://knotes-central-v3.github.io/KnotesCentralV1/). They receive no
updates of any kind.

## Reporting

Email **knotescentral@gmail.com** with the URL or file, what you did, and what
happened. If it is not sensitive, a
[GitHub issue](https://github.com/Developer1010x/knotesneo/issues/new/choose)
is fine and usually faster.

Please do not open a public issue for anything that exposes someone's private
material — mail it instead, and it gets taken down first and discussed after.

Expect a reply within a week. This is maintained by students between semesters,
not a security team.

## Taking material down

If something here is yours and you want it removed — or it was uploaded without
your permission — say so by email and the entry is deleted, no questions asked.
Nothing in this repository hosts files: every entry is a link to a Google Drive
folder or a GitHub repository owned by whoever uploaded it.
