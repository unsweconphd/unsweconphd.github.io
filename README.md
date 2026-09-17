# Econ PhD Handbook

The handbook for PhD students in the UNSW School of Economics, published at
**https://unsweconphd.github.io**. It replaces `econphdhandbook.weebly.com`.

## Editing a page

Every page ends with an **Edit this page on GitHub** link. Follow it, make the
change in GitHub's editor and commit. The site rebuilds itself; the change is
live a minute or two later (progress is under the repository's **Actions** tab).

Pages are Markdown: `**bold**`, `[link text](https://example.com)`, `- ` starts a
bullet, two extra spaces of indentation make a sub-bullet, `## ` starts a heading.

## Where things are

```
content/                      Everything readers see
├── index.md                  Home page; its "Updated" date is set here
├── requirements/             One folder per menu section:
│   ├── index.md                its index.md is the section page,
│   └── timeline-overview.md    every other file is a page in that section
├── funding/
├── phd-seminars/             seminar-schedule.md holds the term timetables
├── miscellaneous/
├── files/                    PDFs, linked from pages as /files/name.pdf
└── 404.njk                   "Page not found"; also forwards old Weebly addresses
theme/                        How pages look
├── base.njk                  Page frame: sidebar menu and footer
├── page.njk                  Ordinary page
├── section.njk               Section page, listing the pages in its section
├── home.njk                  Home page, a table of contents built from the menu
└── style.css                 All styling
eleventy.config.js            Build settings; the site title is at the top
package.json                  Eleventy version and the npm commands
.github/workflows/deploy.yml  Builds and publishes the site on every push to main
```

## Adding a page

Create a Markdown file in the section's folder, for example
`content/funding/conference-grants.md`:

```markdown
---
title: "Conference Grants"
eleventyNavigation:
  key: "Conference Grants"
  parent: "Funding"
  order: 5
---

Page text in Markdown.
```

- `key` is the page's label in the menu, `parent` is the `key` of its section
  (`Requirements`, `Funding`, `PhD Seminars` or `Miscellaneous`), and `order`
  is its position within the section.
- The page appears at `/funding/conference-grants/`, in the sidebar, on the
  home page and on the Funding section page.
- Link to it from other pages as `[Conference grants](/funding/conference-grants/)`.

To add a PDF, upload it to `content/files/` and link to `/files/its-name.pdf`.

A new menu section is a new folder with an `index.md` that uses
`layout: section.njk` and has an `eleventyNavigation` key but no parent; copy
`content/funding/index.md`.

## Previewing on your own computer

Optional. Needs [Node.js](https://nodejs.org) 20 or later.

```bash
npm install      # once
npm run serve    # http://localhost:8080, reloads as you edit
npm run build    # writes the site to _site/
```

## How publishing works

A push to `main` runs `.github/workflows/deploy.yml`, which installs the
Eleventy version pinned in `package-lock.json`, builds the site and deploys
`_site/` to GitHub Pages. `_site/` and `node_modules/` are never committed.
