"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// Adjust this path if this file moves relative to /public/data
import articleData from "../public/data/article.json";

const CATEGORIES = [
  { name: "Home", href: "/" },
  { name: "Business", href: "/business" },
  { name: "Health", href: "/health" },
  { name: "World", href: "/world" },
  { name: "U.S.", href: "/us" },
  { name: "Finance", href: "/finance" },
  { name: "Sports", href: "/sports" },
];

// Flatten every category's articles into one searchable list, built once.
const ALL_ARTICLES = Object.entries(articleData).flatMap(
  ([categorySlug, posts]) =>
    posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      category: post.category,
      categorySlug: post.categorySlug || categorySlug,
      href: `/${post.categorySlug || categorySlug}/${post.slug}`,
    }))
);

const MAX_RESULTS = 8;

function formatDateTime(date) {
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateStr} | Updated ${timeStr}`;
}

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Header() {
  const [now, setNow] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  // lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // clear the query whenever the search bar is closed
  useEffect(() => {
    if (!searchOpen) setQuery("");
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_ARTICLES.filter((a) => a.title.toLowerCase().includes(q)).slice(
      0,
      MAX_RESULTS
    );
  }, [query]);

  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-2 text-xs text-gray-700 border-b border-gray-100">
        <span className="tabular-nums">{now ? formatDateTime(now) : ""}</span>
        <button
          type="button"
          className="bg-amber-400 hover:bg-amber-500 transition-colors text-black text-xs font-bold uppercase tracking-wide px-4 py-1.5"
        >
          Subscribe
        </button>
      </div>

      {/* Main row */}
      <div className="relative flex items-center justify-between px-4 md:px-8 py-4">
        {/* Left: hamburger (mobile) + search (all sizes) */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-gray-900"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <button
            type="button"
            aria-label="Toggle search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className="text-gray-900 hidden md:block"
          >
            <SearchIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Center: logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center select-none">
          <span className="font-serif font-black text-3xl md:text-5xl tracking-tight text-black">
            NEWS<span className="text-blue-700">DESK</span>
          </span>
        </Link>

        {/* Right: search icon on mobile (balances hamburger), spacer on desktop */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Toggle search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className="text-gray-900 md:hidden"
          >
            <SearchIcon className="w-5 h-5" />
          </button>
          {/* invisible spacer to keep the logo visually centered on desktop */}
          <div className="hidden md:block w-5 h-5" aria-hidden="true" />
        </div>
      </div>

      {/* Expandable search bar */}
      {searchOpen && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 md:px-8 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <SearchIcon className="w-4 h-4 text-gray-500 shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search news, topics, authors..."
                className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Live results dropdown */}
            {query.trim() && (
              <div className="mt-3 border-t border-gray-200 pt-3">
                {results.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {results.map((r) => (
                      <li key={r.href}>
                        <Link
                          href={r.href}
                          onClick={() => setSearchOpen(false)}
                          className="block py-2 group"
                        >
                          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                            {r.category}
                          </p>
                          <p className="text-sm text-gray-900 group-hover:text-blue-700 transition-colors">
                            {r.title}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 py-2">
                    No articles found for &ldquo;{query}&rdquo;.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop category nav */}
      <nav className="hidden md:block border-t border-gray-100 px-8">
        <ul className="flex items-center justify-center gap-6 py-3 text-xs font-bold uppercase tracking-wide text-gray-900">
          {CATEGORIES.map((cat) => (
            <li key={cat.href}>
              <Link href={cat.href} className="hover:text-blue-700 transition-colors">
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile sliding drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        {/* backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMenuOpen(false)}
        />
        {/* drawer panel */}
        <div
          className={`absolute top-0 left-0 h-full w-72 max-w-[80%] bg-white shadow-xl transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <span className="font-serif font-black text-xl text-black">
              NEWS<span className="text-blue-700">DESK</span>
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="text-gray-900"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="overflow-y-auto h-[calc(100%-64px)]">
            <ul className="flex flex-col divide-y divide-gray-100">
              {CATEGORIES.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-900 hover:bg-gray-50 hover:text-blue-700"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}