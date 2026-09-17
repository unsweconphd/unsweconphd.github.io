import { HtmlBasePlugin, IdAttributePlugin } from "@11ty/eleventy";
import eleventyNavigation from "@11ty/eleventy-navigation";

export default function (eleventyConfig) {
  // Site-wide settings, used in the page templates as site.title and so on.
  eleventyConfig.addGlobalData("site", {
    title: "Econ PhD Handbook",
    institution: "UNSW School of Economics",
    description:
      "Program requirements, funding, seminars and other resources for PhD students in the UNSW School of Economics.",
    url: "https://unsweconphd.github.io",
    repository: "https://github.com/unsweconphd/unsweconphd.github.io",
    contactEmail: "econ.hdr@unsw.edu.au",
  });

  // Every page uses theme/page.njk unless its front matter names another layout.
  eleventyConfig.addGlobalData("layout", "page.njk");

  // Builds the sidebar menu from the eleventyNavigation block in each page's front matter.
  eleventyConfig.addPlugin(eleventyNavigation);
  // Gives headings ids, so a link can point at a section: /coursework-and-reviews/confirmation-review/#at-the-review
  eleventyConfig.addPlugin(IdAttributePlugin);
  // Keeps links such as /seminars/ working if the site is ever served from a sub-path.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy("content/files");
  eleventyConfig.addPassthroughCopy({ "theme/style.css": "style.css" });

  eleventyConfig.amendLibrary("md", (md) => {
    // Give headings their ids while the Markdown is rendered, so the "On this page" list can link to them.
    md.core.ruler.push("heading_ids", (state) => {
      const slugify = eleventyConfig.getFilter("slugify");
      const used = new Set();
      state.tokens.forEach((token, i) => {
        if (token.type !== "heading_open" || token.attrGet("id")) return;
        const base = slugify(state.tokens[i + 1].content);
        let id = base;
        for (let n = 1; used.has(id); n++) id = `${base}-${n}`;
        used.add(id);
        token.attrSet("id", id);
      });
    });
    // Wrap tables so that wide ones scroll sideways on narrow screens instead of squeezing the page.
    md.renderer.rules.table_open = () => '<div class="table-scroll">\n<table>\n';
    md.renderer.rules.table_close = () => "</table>\n</div>\n";
  });

  // The level-2 headings of a rendered page, for its "On this page" list (pages with toc: true).
  eleventyConfig.addFilter("pageHeadings", (html) =>
    [...String(html).matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)].map(([, id, text]) => ({
      id,
      text: text.replace(/<[^>]+>/g, ""),
    })),
  );

  // Old addresses listed under redirectFrom in a page's front matter; content/redirects.njk
  // turns each into a page that forwards to the page's current address.
  eleventyConfig.addCollection("redirects", (collectionApi) =>
    collectionApi.getAll().flatMap((item) => (item.data.redirectFrom ?? []).map((from) => ({ from, to: item.url }))),
  );

  eleventyConfig.addFilter("readableDate", (date) =>
    new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date),
  );
}

export const config = {
  dir: {
    input: "content",
    includes: "../theme",
    output: "_site",
  },
  // Pages are plain Markdown: a {{ or {% typed into a page appears as written.
  markdownTemplateEngine: false,
};
