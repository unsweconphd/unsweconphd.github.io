import { HtmlBasePlugin, IdAttributePlugin } from "@11ty/eleventy";
import eleventyNavigation from "@11ty/eleventy-navigation";

export default function (eleventyConfig) {
  // Site-wide settings, used in the page templates as site.title and so on.
  eleventyConfig.addGlobalData("site", {
    title: "Econ PhD Handbook",
    institution: "UNSW School of Economics",
    description:
      "Program requirements, funding, seminars and other resources for PhD students in the UNSW School of Economics.",
    repository: "https://github.com/unsweconphd/unsweconphd.github.io",
  });

  // Every page uses theme/page.njk unless its front matter names another layout.
  eleventyConfig.addGlobalData("layout", "page.njk");

  // Builds the sidebar menu from the eleventyNavigation block in each page's front matter.
  eleventyConfig.addPlugin(eleventyNavigation);
  // Gives headings ids, so a link can point at a section: /requirements/confirmation-review/#format-of-the-confirmation-review
  eleventyConfig.addPlugin(IdAttributePlugin);
  // Keeps links such as /funding/ working if the site is ever served from a sub-path.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy("content/files");
  eleventyConfig.addPassthroughCopy({ "theme/style.css": "style.css" });

  eleventyConfig.addFilter("readableDate", (date) =>
    new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date),
  );

  // Maps old Weebly page names (confirmation-review.html) to their new addresses; used by content/404.njk.
  eleventyConfig.addFilter("legacyRedirects", (pages) => {
    const redirects = { "coursework-mpdbs--phd": "/requirements/coursework-mpdbs-phd/" };
    for (const { url } of pages) {
      const slug = typeof url === "string" ? url.split("/").filter(Boolean).pop() : undefined;
      if (slug) redirects[slug] ??= url;
    }
    return redirects;
  });
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
