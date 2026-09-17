# Econ PhD Handbook

The handbook for PhD students in the UNSW School of Economics, published at
**https://unsweconphd.github.io**. It replaces `econphdhandbook.weebly.com`.

## Using an AI assistant

To have an AI assistant (Claude Code, Codex, Cursor, Copilot, ChatGPT…) set up
your computer and make changes for you, give it this prompt:

> Read https://raw.githubusercontent.com/unsweconphd/unsweconphd.github.io/main/AGENTS.md and follow its "Setup" section to set up my computer to edit the Econ PhD Handbook. Stop and ask me whenever a step needs my password, a login in my browser, or a decision.

[AGENTS.md](AGENTS.md) covers installation, how the site is organised, how to
publish a change, and the rules for its content. Claude Code, Codex and most
coding assistants read it automatically once the repository is on your
computer.

## Editing a page

Every page ends with an **Edit this page on GitHub** link. Follow it, make the
change in GitHub's editor and commit. The site rebuilds itself; the change is
live a minute or two later (progress is under the repository's **Actions** tab).

Pages are Markdown: `**bold**`, `[link text](https://example.com)`, `- ` starts a
bullet, `1. ` starts a numbered step, two extra spaces of indentation make a
sub-bullet, `## ` starts a heading, and a table is rows of `| cell | cell |`.

When you have checked a page is still correct, update its `reviewed` date.

## Where things are

```
content/                      Everything readers see
├── index.md                  Home page; its "Updated" date is set here
├── getting-started/          One folder per menu section:
│   ├── index.md                its index.md is the section page,
│   ├── key-dates.md            every other file is a page in that section
│   ├── timeline.md
│   └── contacts.md
├── coursework-and-reviews/
├── seminars/                 schedule.md holds the term timetables
├── funding-and-travel/
├── research-resources/
├── thesis/                   publications, submission, oral examination
├── files/                    PDFs, linked from pages as /files/name.pdf
├── redirects.njk             Forwards old addresses to where pages are now
└── 404.njk                   "Page not found"
theme/                        How pages look
├── base.njk                  Page frame: sidebar menu and footer
├── page.njk                  Ordinary page: title, review date, "On this page" list
├── section.njk               Section page: introduction, then its pages
├── home.njk                  Home page, a table of contents built from the menu
└── style.css                 All styling
scripts/check-site.mjs        What `npm run check` runs
eleventy.config.js            Build settings; the site title and contact email are at the top
package.json                  Eleventy version and the npm commands
.github/workflows/deploy.yml  Builds and publishes the site on every push to main
AGENTS.md                     Instructions for AI assistants (CLAUDE.md points to it)
```

## Adding a page

Create a Markdown file in the section's folder, for example
`content/funding-and-travel/conference-grants.md`:

```markdown
---
title: "Conference grants"
reviewed: 2026-09-17
toc: true
eleventyNavigation:
  key: "Conference grants"
  parent: "Funding and travel"
  order: 5
---

Page text in Markdown.
```

- `title` is the page heading; use sentence case.
- `reviewed` is the date someone last checked the page is correct. It is shown
  under the title.
- `toc: true` adds an "On this page" list of the page's `## ` headings. Use it
  on long pages.
- `key` is the page's label in the menu, `parent` is the `key` of its section
  (`Getting started`, `Coursework and reviews`, `Seminars`,
  `Funding and travel`, `Research resources` or `Thesis`), and `order` is its
  position within the section.
- The page appears at `/funding-and-travel/conference-grants/`, in the sidebar,
  on the home page and on the section page.
- Link to it from other pages as `[conference grants](/funding-and-travel/conference-grants/)`.

To add a PDF, upload it to `content/files/` and link to `/files/its-name.pdf`.

A new menu section is a new folder with an `index.md` that uses
`layout: section.njk` and has an `eleventyNavigation` key but no parent; copy
`content/seminars/index.md`.

## Moving or renaming a page

A page's address comes from its folder and file name, so moving or renaming
the file changes it. To keep old links working, list the old address under
`redirectFrom` in the page's front matter:

```markdown
redirectFrom:
  - /seminars/old-name/
```

The build then publishes a small page at the old address that forwards to the
new one. The same mechanism forwards the old Weebly addresses, such as
`/confirmation-review.html`.

## Previewing on your own computer

Optional. Needs [Node.js](https://nodejs.org) 22 or later.

```bash
npm ci           # once, and after package-lock.json changes
npm run serve    # http://localhost:8080, reloads as you edit
npm run check    # builds from scratch and checks links, forwarding pages and the menu
```

Run `npm run check` before you push: it must end with `Site OK`.

## How publishing works

A push to `main` runs `.github/workflows/deploy.yml`, which installs the
Eleventy version pinned in `package-lock.json`, builds the site and deploys
`_site/` to GitHub Pages. `_site/` and `node_modules/` are never committed.
