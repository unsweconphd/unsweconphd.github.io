// Builds the site from scratch and checks it before you publish:
// - every internal link leads to a page or file that exists;
// - every forwarding page (from redirectFrom) leads to a page that exists;
// - every page appears in the sidebar menu (catches a misspelt eleventyNavigation parent).
// Run with `npm run check`. Exits with an error if anything is wrong.
import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const site = "_site";

// Start from an empty _site, so pages that no longer exist can't hide broken links.
rmSync(site, { recursive: true, force: true });
try {
  execSync("npx @11ty/eleventy --quiet", { stdio: "inherit" });
} catch {
  console.error(
    "\nThe build failed; the Eleventy error above names the file. A common cause is an eleventyNavigation " +
      '"parent" that doesn\'t exactly match a section key ("Node does not exist"), or broken front matter.',
  );
  process.exit(1);
}

const htmlFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith(".html")) htmlFiles.push(path);
  }
})(site);

const urlOf = (file) => "/" + relative(site, file).split(sep).join("/").replace(/index\.html$/, "");

const exists = (url) => {
  const path = join(site, decodeURI(url.split("#")[0].split("?")[0]));
  return (existsSync(path) && statSync(path).isFile()) || existsSync(join(path, "index.html"));
};

const problems = [];
const pages = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const url = urlOf(file);
  const forward = html.match(/http-equiv="refresh" content="0; url=([^"]+)"/);
  if (forward) {
    if (!exists(forward[1])) problems.push(`${url} forwards to ${forward[1]}, which doesn't exist`);
    continue;
  }
  if (url !== "/404.html") pages.push(url);
  for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
    if (!exists(href)) problems.push(`${url} links to ${href}, which doesn't exist`);
  }
}

const home = readFileSync(join(site, "index.html"), "utf8");
const menu = home.match(/<nav aria-label="Handbook contents">([\s\S]*?)<\/nav>/)?.[1] ?? "";
const inMenu = new Set([...menu.matchAll(/href="([^"]+)"/g)].map(([, href]) => href));
for (const url of pages) {
  if (url !== "/" && !inMenu.has(url)) {
    problems.push(`${url} is not in the menu: check its eleventyNavigation key and parent`);
  }
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s) found:`);
  for (const problem of [...new Set(problems)]) console.error(`- ${problem}`);
  process.exit(1);
}
console.log(`\nSite OK: ${pages.length} pages, all internal links and forwarding pages resolve, all pages are in the menu.`);
