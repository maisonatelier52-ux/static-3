"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Adjust these paths if this file moves relative to /public/data
import articleData from "../../../public/data/article.json";
import authorData from "../../../public/data/author.json";

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.1-9.3L1 2h7.4l5 6.7L18.9 2Zm-1.3 18h2L7.5 4H5.3l12.3 16Z" />
    </svg>
  );
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21H18.4v-5.7c0-1.36-.02-3.1-1.9-3.1-1.9 0-2.2 1.48-2.2 3v5.8H10V9Z" />
    </svg>
  );
}

const SOCIAL_ICONS = {
  twitter: XIcon,
  linkedin: LinkedinIcon,
};

// Dates in article.json are stored as "DD/MM/YYYY"
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

const formatDate = (dateStr) => {
  const d = parseDate(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Looks up the author whose `slug` matches the URL param, and pulls their
// articles by filtering every category in article.json down to this author.
function getAuthorData(authorSlug) {
  const entry = Object.entries(authorData).find(
    ([, info]) => info.slug === authorSlug
  );
  const [authorName, authorInfo] = entry || [null, null];

  const name =
    authorName ??
    (authorSlug
      ? authorSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "Author");

  const articles = Object.values(articleData)
    .flat()
    .filter(
      (post) =>
        post.author === authorName &&
        (!authorInfo?.category || post.categorySlug === authorInfo.category)
    )
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .map((post) => ({
      href: `/${post.categorySlug || post.category?.toLowerCase()}/${post.slug}`,
      image: post.image,
      headline: post.title,
      description: post.dek,
      byline: `${name} | ${formatDate(post.date)}`,
    }));

  return {
    name,
    title: authorInfo?.title || "Staff Writer",
    location: authorInfo?.location || "",
    bio:
      authorInfo?.bio ||
      "Placeholder author bio. A few sentences about this reporter's beat, background, and the kind of stories they cover, giving readers a sense of who's behind the byline.",
    email: authorInfo?.social?.email
      ? authorInfo.social.email.replace(/^mailto:/, "")
      : `${authorSlug}@example.com`,
    image: authorInfo?.avatar || `/images/authors/${authorSlug}.jpg`,
    socials: authorInfo?.social
      ? Object.entries(authorInfo.social)
          .filter(([key]) => key !== "email" && SOCIAL_ICONS[key])
          .map(([key, href]) => ({
            label: key,
            href,
            Icon: SOCIAL_ICONS[key],
          }))
      : [],
    articles,
  };
}

export default function AuthorPage() {
  const { author } = useParams();
  const data = getAuthorData(author);
  const [imageFailed, setImageFailed] = useState(false);

  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      {/* Author profile header */}
      <div className="flex flex-col sm:flex-row items-start gap-6 pb-8 border-b-2 border-gray-900">
        <div className="w-36 h-36 rounded-full bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
          {!imageFailed ? (
            <img
              src={data.image}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span className="text-3xl font-bold text-gray-600">
              {initials}
            </span>
          )}
        </div>
        <div>
          <h1 className="font-serif font-bold text-gray-900 text-2xl md:text-3xl">
            {data.name}
          </h1>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700 mt-1">
            {data.title} {data.location && `· ${data.location}`}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mt-3 max-w-2xl">
            {data.bio}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a
              href={`mailto:${data.email}`}
              aria-label="Email"
              className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-700 hover:border-blue-700 hover:text-blue-700 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </a>
            {data.socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-700 hover:border-blue-700 hover:text-blue-700 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Articles by this author */}
      <div className="mt-8">
        <h2 className="font-serif font-bold text-xl text-gray-900 mb-6">
          Articles by {data.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
          {data.articles.map((article) => (
            <div key={article.href}>
              <Link
                href={article.href}
                className="block mb-3 aspect-[16/10] overflow-hidden"
              >
                <img
                  src={article.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </Link>
              <Link href={article.href} className="block">
                <h3 className="font-serif font-bold text-gray-900 leading-tight text-lg hover:text-blue-700 transition-colors">
                  {article.headline}
                </h3>
              </Link>
              <p className="text-sm text-gray-700 leading-relaxed mt-2">
                {article.description}
              </p>
              <p className="text-xs text-gray-500 mt-2">{article.byline}</p>
            </div>
          ))}
        </div>
      </div>
      
    </main>
  );
}