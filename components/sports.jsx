import Link from "next/link";

// Adjust this path if this file moves relative to /public/data
import articleData from "../public/data/article.json";
import authorData from "../public/data/author.json";

const CATEGORY = "sports";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

function bylineFor(authorName) {
  const location = authorData[authorName]?.location;
  return location ? `${authorName} | ${location.toUpperCase()}` : authorName;
}

// 4 newest Sports articles, each used exactly once.
function getSportsCards() {
  const posts = [...(articleData[CATEGORY] || [])].sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  );

  return posts.slice(0, 4).map((post) => ({
    href: `/${CATEGORY}/${post.slug}`,
    image: post.image,
    headline: post.title,
    byline: bylineFor(post.author),
  }));
}

export default function Sports() {
  const cards = getSportsCards();

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <div className="border-t-4 border-gray-900 pt-4 mb-6">
        <h2 className="font-serif font-bold text-2xl text-gray-900 border-b border-gray-900 pb-2">
          Sports
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.href}>
            <Link
              href={card.href}
              className="block mb-3 aspect-[16/10] overflow-hidden"
            >
              <img
                src={card.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </Link>
            <Link href={card.href} className="block">
              <h3 className="font-serif font-bold text-gray-900 leading-tight text-lg hover:text-blue-700 transition-colors">
                {card.headline}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 mt-2">{card.byline}</p>
          </div>
        ))}
      </div>

      <hr className="border-gray-900 mt-10" />
    </section>
  );
}