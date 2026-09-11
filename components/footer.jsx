"use client";

import Link from "next/link";

const SECTIONS = [
  { name: "Business", href: "/business" },
  { name: "Health", href: "/health" },
  { name: "World", href: "/world" },
  { name: "U.S.", href: "/us" },
  { name: "Finance", href: "/finance" },
  { name: "Sports", href: "/sports" },
];

const COMPANY = [
  { name: "About us", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
  { name: "Advertise with us", href: "/advertise" },
  { name: "Newsletters", href: "/newsletters" },
];

const LEGAL = [
  { name: "Privacy policy", href: "/privacy" },
  { name: "Terms of service", href: "/terms" },
  { name: "Cookie policy", href: "/cookies" },
  { name: "Accessibility", href: "/accessibility" },
  { name: "Corrections", href: "/corrections" },
];

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.1-9.3L1 2h7.4l5 6.7L18.9 2Zm-1.3 18h2L7.5 4H5.3l12.3 16Z" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 22v-8.4h2.8l.4-3.3h-3.2V8.1c0-.9.3-1.6 1.7-1.6h1.7V3.5C16.6 3.4 15.5 3.3 14.3 3.3c-2.6 0-4.4 1.6-4.4 4.5v2.5H7.1v3.3h2.8V22h3.6Z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
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

function RssIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <circle cx="5.5" cy="18.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4.5a15.5 15.5 0 0 1 15.5 15.5" />
    </svg>
  );
}

const SOCIALS = [
  { name: "X", href: "https://x.com", Icon: XIcon },
  { name: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { name: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { name: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinIcon },
  { name: "RSS", href: "/rss", Icon: RssIcon },
];

function LinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wide text-gray-900 mb-3">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-gray-600 hover:text-blue-700 transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // wire up to your newsletter provider here
  };

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      {/* Newsletter */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="font-serif font-black text-2xl tracking-tight text-black">
              NEWS<span className="text-blue-700">DESK</span>
            </span>
            <p className="text-sm text-gray-600 mt-1">
              Get the day's top stories in your inbox every morning.
            </p>
          </div>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex w-full md:w-auto max-w-md"
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="flex-1 min-w-0 border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-700"
            />
            <button
              type="submit"
              className="shrink-0 bg-amber-400 hover:bg-amber-500 transition-colors text-black text-xs font-bold uppercase tracking-wide px-4 py-2"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <LinkColumn title="Sections" links={SECTIONS} />
        <LinkColumn title="Company" links={COMPANY} />
        <LinkColumn title="Legal" links={LEGAL} />
        <div className="text-center md:text-left">
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-900 mb-3">
            About us
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            NewsDesk brings you independent reporting and analysis on the
            stories that matter, from breaking news to in-depth features.
          </p>
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-900 mb-3">
            Follow us
          </h3>
          <ul className="flex flex-wrap gap-3 justify-center md:justify-start">
            {SOCIALS.map(({ name, href, Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  aria-label={name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 border border-gray-300 text-gray-700 hover:border-blue-700 hover:text-blue-700 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex flex-col-reverse md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>&copy; {year} NewsDesk. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/sitemap" className="hover:text-blue-700 transition-colors">
              Sitemap
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-blue-700 transition-colors"
            >
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}