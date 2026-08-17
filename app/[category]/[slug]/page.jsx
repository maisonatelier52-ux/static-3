import Link from "next/link";

// Adjust these paths if this file moves relative to /public/data
import articleData from "../../../public/data/article.json";
import authorData from "../../../public/data/author.json";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

const formatDate = (dateStr) =>
  parseDate(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// Looks up the article matching { category, slug } in article.json, and
// merges in author details (bio, location, slug) from author.json by name.
function getArticle(category, slug) {
  const post = (articleData[category] || []).find((p) => p.slug === slug);

  if (!post) {
    // fallback so the page still renders something sensible if the
    // category/slug combo isn't found in the data
    return {
      category,
      slug,
      headline: "Article not found",
      dek: "",
      author: "",
      authorSlug: "",
      authorBio: "",
      location: "",
      publishedAt: "",
      readTime: "",
      heroImage: "/images/img1.webp",
      heroCaption: "",
      tags: [],
      body: [],
    };
  }

  const authorInfo = authorData[post.author] || {};

  return {
    category: post.categorySlug || category,
    slug: post.slug,
    headline: post.title,
    dek: post.dek,
    author: post.author,
    authorSlug: authorInfo.slug || "",
    authorBio: authorInfo.bio || "",
    location: authorInfo.location ? authorInfo.location.toUpperCase() : "",
    publishedAt: formatDate(post.date),
    readTime: "6 min read",
    heroImage: post.image,
    heroCaption: "Placeholder hero image caption. PHOTO CREDIT",
    tags: post.tags || [post.category],
    body: post.body || [],
  };
}

// Up to 3 other articles from the same category, excluding the current one
function getRelated(category, slug) {
  return (articleData[category] || [])
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({
      href: `/${p.categorySlug || category}/${p.slug}`,
      image: p.image,
      headline: p.title,
      byline: `${p.author}${
        authorData[p.author]?.location
          ? " | " + authorData[p.author].location.toUpperCase()
          : ""
      }`,
    }));
}

function ShareIcon({ path, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d={path} />
    </svg>
  );
}

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  return {
    title: article.headline,
    description: article.dek,
  };
}

export default async function ArticlePage({ params }) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  const RELATED = getRelated(category, slug);

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      {/* Headline block */}
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/${article.category}`}
          className="text-xs font-bold uppercase tracking-wide text-blue-700 hover:underline"
        >
          {article.category}
        </Link>

        <h1 className="font-serif font-bold text-gray-900 leading-tight text-3xl md:text-5xl mt-3">
          {article.headline}
        </h1>

        <p className="font-serif text-gray-700 text-xl leading-relaxed mt-4">
          {article.dek}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 py-4 border-y border-gray-200">
          <div>
            <p className="text-sm font-bold text-gray-900">
              {article.authorSlug ? (
                <Link
                  href={`/authors/${article.authorSlug}`}
                  className="hover:text-blue-700 transition-colors"
                >
                  {article.author}
                </Link>
              ) : (
                article.author
              )}
              {article.location && (
                <span className="font-normal text-gray-500">
                  {" "}
                  | {article.location}
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {article.publishedAt} · {article.readTime}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Share on X"
              className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-700 hover:border-blue-700 hover:text-blue-700 transition-colors"
            >
              <ShareIcon
                className="w-4 h-4"
                path="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.1-9.3L1 2h7.4l5 6.7L18.9 2Zm-1.3 18h2L7.5 4H5.3l12.3 16Z"
              />
            </a>
            <a
              href="#"
              aria-label="Share on Facebook"
              className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-700 hover:border-blue-700 hover:text-blue-700 transition-colors"
            >
              <ShareIcon
                className="w-4 h-4"
                path="M13.5 22v-8.4h2.8l.4-3.3h-3.2V8.1c0-.9.3-1.6 1.7-1.6h1.7V3.5C16.6 3.4 15.5 3.3 14.3 3.3c-2.6 0-4.4 1.6-4.4 4.5v2.5H7.1v3.3h2.8V22h3.6Z"
              />
            </a>
            <a
              href="#"
              aria-label="Copy link"
              className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-700 hover:border-blue-700 hover:text-blue-700 transition-colors"
            >
              <ShareIcon
                className="w-4 h-4"
                path="M3.9 12a4 4 0 0 1 4-4h3v1.6h-3a2.4 2.4 0 1 0 0 4.8h3V16h-3a4 4 0 0 1-4-4Zm6-.8h4.2v1.6H9.9v-1.6ZM13 8h3a4 4 0 1 1 0 8h-3v-1.6h3a2.4 2.4 0 1 0 0-4.8h-3V8Z"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Hero image — wider than the text column */}
      <div className="my-8">
        <img
          src={article.heroImage}
          alt=""
          className="w-full h-auto object-cover"
        />
        <p className="text-xs text-gray-500 mt-2 max-w-3xl mx-auto">
          {article.heroCaption}
        </p>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto">
        {article.body.map((block, i) => {
          if (block.type === "paragraph") {
            return (
              <p
                key={i}
                className="text-lg text-gray-800 leading-relaxed mb-6"
              >
                {block.text}
              </p>
            );
          }
          if (block.type === "heading") {
            return (
              <h2
                key={i}
                className="font-serif font-bold text-2xl text-gray-900 mt-10 mb-4"
              >
                {block.text}
              </h2>
            );
          }
          if (block.type === "quote") {
            return (
              <blockquote
                key={i}
                className="border-l-4 border-blue-700 pl-6 my-8"
              >
                <p className="font-serif text-2xl text-gray-900 leading-snug">
                  {block.text}
                </p>
              </blockquote>
            );
          }
          if (block.type === "image") {
            return (
              <figure key={i} className="my-8">
                <img
                  src={block.src}
                  alt=""
                  className="w-full h-auto object-cover"
                />
                <figcaption className="text-xs text-gray-500 mt-2">
                  {block.caption}
                </figcaption>
              </figure>
            );
          }
          return null;
        })}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-10">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag.toLowerCase()}`}
              className="text-xs font-bold uppercase tracking-wide text-gray-600 border border-gray-300 px-3 py-1.5 hover:border-blue-700 hover:text-blue-700 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Author bio */}
        <div className="flex items-start gap-4 mt-10 pt-8 border-t border-gray-200">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-gray-600">
              {article.author
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              {article.authorSlug ? (
                <Link
                  href={`/authors/${article.authorSlug}`}
                  className="hover:text-blue-700 transition-colors"
                >
                  {article.author}
                </Link>
              ) : (
                article.author
              )}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-1">
              {article.authorBio}
            </p>
          </div>
        </div>
      </div>

      {/* Related stories */}
      <div className="mt-14 pt-8 border-t-4 border-gray-900">
        <h2 className="font-serif font-bold text-2xl text-gray-900 mb-6">
          Related stories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {RELATED.map((story) => (
            <div key={story.href}>
              <Link href={story.href} className="block mb-3">
                <img
                  src={story.image}
                  alt=""
                  className="w-full h-auto object-cover"
                />
              </Link>
              <Link href={story.href} className="block">
                <h3 className="font-serif font-bold text-gray-900 leading-tight text-base hover:text-blue-700 transition-colors">
                  {story.headline}
                </h3>
              </Link>
              <p className="text-xs text-gray-500 mt-2">{story.byline}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}