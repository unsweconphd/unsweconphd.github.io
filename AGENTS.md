# Instructions for AI assistants

This file tells an AI assistant (Claude Code, Codex, Cursor, GitHub Copilot, ChatGPT and similar) how to set up a computer to work on the **Econ PhD Handbook**, and how to change the site safely. People should read [README.md](README.md) instead.

To use it, give your assistant this prompt:

> Read https://raw.githubusercontent.com/unsweconphd/unsweconphd.github.io/main/AGENTS.md and follow its "Setup" section to set up my computer to edit the Econ PhD Handbook. Stop and ask me whenever a step needs my password, a login in my browser, or a decision.

An assistant without a terminal (for example ChatGPT in a browser) can't run the commands itself. It should give the person one step at a time and wait for the output, or suggest "Editing without any setup" below.

## The project

The Econ PhD Handbook is the guide for PhD students in the UNSW School of Economics, published at https://unsweconphd.github.io. The source is the public repository https://github.com/unsweconphd/unsweconphd.github.io. The site is built with [Eleventy 3](https://www.11ty.dev) from Markdown pages. A push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it on GitHub Pages within a couple of minutes.

## Rules for the assistant

- **Ask before anything public or hard to undo:** pushing to `main`, merging a pull request, or deleting files or branches. Once the person has agreed to a change, pushing a branch and opening a pull request is fine.
- **Logins happen in the person's browser.** Never ask for, type, store or print passwords, tokens or one-time codes.
- **Keep secrets and private details out.** The repository and the site are public. Never commit passwords, meeting passcodes, or personal details beyond work contact details already published by UNSW.
- **Don't invent facts.** Follow "Content rules" below.

## Setup

Work through the steps in order. Each step ends with a check: don't move on until it passes.

### 1. Things only the person can do

Ask the person to confirm three things:

1. They have a GitHub account. If not, they create one at https://github.com/signup.
2. They have accepted the invitation to the `unsweconphd` organization at https://github.com/orgs/unsweconphd/invitation. If there is no invitation, they send their GitHub username to an organization owner (the School's PhD coordinator) and wait for one.
3. Which operating system they use: macOS, Windows or Linux.

### 2. Install Git, Node.js and the GitHub CLI

See what is already installed:

```bash
git --version
node --version
npm --version
gh --version
```

The site needs Git, Node.js 22 or newer (24 LTS recommended; the live site builds with 24), and the GitHub CLI (`gh`). Install whatever is missing:

- **macOS with Homebrew:** `brew install git node gh`
- **macOS without Homebrew:** either install Homebrew from https://brew.sh first (the person must run its installer, because it asks for their password), or use the installers from https://nodejs.org and https://cli.github.com. Git comes with the Xcode Command Line Tools: `xcode-select --install`.
- **Windows:** run these, then open a new terminal so the new commands are found:
  ```powershell
  winget install --id Git.Git -e
  winget install --id OpenJS.NodeJS.LTS -e
  winget install --id GitHub.cli -e
  ```
- **Linux:** Git from the system package manager; Node.js from https://nodejs.org/en/download; the GitHub CLI following https://github.com/cli/cli/blob/trunk/docs/install_linux.md.

**Check:** all four commands print a version, and `node --version` prints v22 or higher.

### 3. Log in to GitHub

```bash
gh auth login --hostname github.com --git-protocol https --web
gh auth setup-git
```

The first command shows a one-time code and opens the browser. The person enters the code and approves the login there. The second command makes `git` use the same login.

**Check:**

```bash
gh api user --jq .login
gh api user/memberships/orgs/unsweconphd --jq .state
```

The first prints the person's GitHub username; the second must print `active`.

- **`pending`:** the invitation hasn't been accepted yet (step 1).
- **An error about "OAuth App access restrictions":** the person opens https://github.com/settings/connections/applications/178c6fc778ccc68e1d6a (the GitHub CLI) and clicks **Request** (or **Grant**) next to `unsweconphd`. An organization owner then approves it.

### 4. Get a copy of the site

Put the copy in a folder that is **not** synced by Dropbox, iCloud Drive, OneDrive or Google Drive: sync services corrupt Git repositories. A `GitHub` folder in the home directory works well.

macOS and Linux:

```bash
mkdir -p ~/GitHub && cd ~/GitHub
gh repo clone unsweconphd/unsweconphd.github.io
cd unsweconphd.github.io
```

Windows (PowerShell):

```powershell
New-Item -ItemType Directory -Force "$HOME\GitHub" | Out-Null
Set-Location "$HOME\GitHub"
gh repo clone unsweconphd/unsweconphd.github.io
Set-Location unsweconphd.github.io
```

**Check:** `git remote -v` shows `https://github.com/unsweconphd/unsweconphd.github.io.git`.

### 5. Install and check the site

```bash
npm ci
npm run check
```

`npm ci` installs the exact Eleventy version recorded in `package-lock.json`. `npm run check` builds the site from scratch, then checks the result: every internal link and old-address forward must resolve, and every page must be in the menu.

**Check:** the last line starts with `Site OK:`.

### 6. Preview

```bash
npm run serve
```

The site is served at http://localhost:8080, and pages rebuild as files are saved. Stop it with Ctrl+C. An assistant should run this in the background.

**Check:** http://localhost:8080 shows the handbook.

### 7. Confirm permission to publish

```bash
gh api repos/unsweconphd/unsweconphd.github.io --jq .permissions.push
```

**Check:** `true` means the person can push branches and merge. `false` means they can still propose changes: `gh pr create` offers to make a fork, and an owner merges the pull request.

Setup is complete when steps 2 to 7 pass. Tell the person what was installed, where the copy is, and how to preview it (`npm run serve`).

## Editing without any setup

Every page on the site ends with **Edit this page on GitHub**. That opens the page's Markdown file in GitHub's web editor; committing the change there publishes it within a couple of minutes. This needs only a GitHub account with access to the organization, and is enough for small text changes.

## How the site is organised

```
content/                      Everything readers see
├── index.md                  Home page; its "updated" date is shown on the page
├── getting-started/          One folder per menu section:
│   ├── index.md                the section page (layout: section.njk)
│   ├── key-dates.md            every other file is a page in that section
│   ├── timeline.md
│   └── contacts.md             includes the glossary
├── coursework-and-reviews/
├── seminars/                 schedule.md holds the seminar timetables
├── funding-and-travel/
├── research-resources/
├── files/                    PDFs, linked from pages as /files/name.pdf
├── redirects.njk             Builds the forwarding pages for old addresses
└── 404.njk                   "Page not found"
theme/                        Page templates (base, page, section, home) and style.css
scripts/check-site.mjs        What `npm run check` runs
eleventy.config.js            Build settings; site title and contact email are at the top
.github/workflows/deploy.yml  Builds and publishes the site on every push to main
AGENTS.md                     This file; CLAUDE.md points Claude Code to it
```

The sidebar menu, the home page and the section pages are generated from each page's front matter. Never maintain lists of links to pages by hand.

A page's address comes from its folder and file name: `content/seminars/schedule.md` is published at `/seminars/schedule/`.

### Front matter

```markdown
---
title: "Seminar schedule"
reviewed: 2026-09-17
toc: true
eleventyNavigation:
  key: "Schedule"
  parent: "Seminars"
  order: 1
redirectFrom:
  - /seminar-schedule.html
---
```

| Field | Meaning |
|-------|---------|
| `title` | Page heading and browser title. Sentence case. |
| `reviewed` | Date someone last checked the page is correct, shown under the title. |
| `toc` | `true` adds an "On this page" list of the page's `##` headings. Use it on long pages. |
| `eleventyNavigation.key` | The page's label in the menu. Must be unique. |
| `eleventyNavigation.parent` | The `key` of the page's section, exactly: `Getting started`, `Coursework and reviews`, `Seminars`, `Funding and travel`, `Research resources`, `Thesis` or `For supervisors`. Section pages have no parent. |
| `eleventyNavigation.order` | Position within the section. |
| `redirectFrom` | Old addresses that should forward to this page. |
| `layout` | Only for special pages: `section.njk` for a section's `index.md`, `home.njk` for the home page. |

Markdown pages are rendered as plain Markdown: template syntax such as `{{ }}` is not processed. Headings get ids automatically, and tables are wrapped so wide ones scroll on phones.

## Making a change

1. Start from an up-to-date `main`: `git switch main` then `git pull`.
2. Create a branch: `git switch -c short-description-of-change`.
3. Edit files under `content/`. Change `theme/` or `eleventy.config.js` only when the person asks for a design or build change.
4. Run `npm run check`. It must end with `Site OK:`.
5. Show the person the change (`git diff`), and preview it if the layout changed.
6. Commit: `git add -A`, then `git commit -m "Describe the change"`.
7. Publish for review: `git push -u origin HEAD`, then `gh pr create --fill`. Give the person the pull request link.
8. Merge once the person agrees: `gh pr merge --squash --delete-branch`. Then `git switch main`, `git pull`, and follow the deploy with `gh run watch`. Finally, check the changed page on https://unsweconphd.github.io.

For a typo, the person may prefer to skip the pull request: commit on `main`, run `npm run check`, then `git push`, having first asked the person.

## Content rules

- **Readers:** PhD students in the School of Economics, including students in the one-year MPDBS program before the PhD; their supervisors; and School staff.
- **Style:**
  - Australian English, plain and direct wording, sentence-case titles and headings.
  - "must" for UNSW or School rules, "normally" for expectations, "we recommend" for advice.
  - Procedures as numbered steps; documents and deadlines as tables.
  - At most two levels of bullets. Bold only for key deadlines and numbers.
- **Acronyms:** spell each one out at its first use on a page, and add new ones to the glossary in `content/getting-started/contacts.md`.
- **One home for each rule:** state it on one page and link to it from elsewhere. Grade requirements live on the coursework pages; review requirements on the review pages; seminar duties on `content/seminars/requirements.md`.
- **No unverified facts:** UNSW policy, systems, forms, course codes, fees and dates must come from an official source you have actually checked in this session, for example:
  - UNSW Policy Hub: https://www.unsw.edu.au/governance/policy
  - UNSW Handbook: https://www.handbook.unsw.edu.au
  - Class Timetable: https://timetable.unsw.edu.au/current/ECONKENS.html

  School decisions (grade thresholds, seminar rules, funding amounts, contacts) come from the School's PhD coordinator. If you can't verify something, ask the person; don't guess.
- **Links:** mark links that need a UNSW login "(UNSW login required)". Prefer linking to publishers and official pages over uploading PDFs, and only upload files the School may share publicly.
- **Dates on pages:**
  - When you check or change a page, set its `reviewed` date to today.
  - After a substantial revision, also update `updated` in `content/index.md`.
  - When a date changes anywhere, update `content/getting-started/key-dates.md` to match.
- **Moving or renaming a page:** add its old address to `redirectFrom` and fix links to it. `npm run check` reports anything missed.
- **Seminar schedule** (`content/seminars/schedule.md`):
  - The current term comes first; earlier terms go under "Earlier in <year>".
  - Columns: Week, Date, Presenter, Discussant, Job market talk. Use "—" where there is no talk.
  - The date for week N is the term's first Monday plus 7 × (N − 1) days, then forward to the seminar's weekday. Take the first Monday from the Class Timetable for that year.

## Troubleshooting

- **`npm ci` fails or warns about an unsupported engine:** Node.js is too old. Install Node.js 22 or newer (step 2).
- **`npm run check` says the build failed:** the Eleventy error above names the file. The usual causes are an `eleventyNavigation.parent` that doesn't exactly match a section key ("Node does not exist"), or broken front matter (for example an unquoted title containing a colon).
- **`npm run check` lists problems:** fix each link or forwarding address it names, or the page's `eleventyNavigation` block.
- **`git push` is refused (403 or "permission denied"):** check organization membership and the GitHub CLI login (steps 1 and 3) and push permission (step 7).
- **Port 8080 is in use:** `npx @11ty/eleventy --serve --port=8081`.
- **A deploy failed:** run `gh run list --limit 3`, then `gh run view <run-id> --log-failed`. The live site keeps the previous version until a deploy succeeds.
- **"Edit this page on GitHub" offers to fork the repository:** the person isn't signed in as an organization member. They can still propose the change through the fork, or accept the invitation first (step 1).
