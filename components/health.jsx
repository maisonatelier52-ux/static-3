import Link from "next/link";

// Adjust this path if this file moves relative to /public/data
import articleData from "../public/data/article.json";
import authorData from "../public/data/author.json";

const CATEGORY = "health";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

function bylineFor(authorName) {
  const location = authorData[authorName]?.location;
  return location ? `${authorName} | ${location.toUpperCase()}` : authorName;
}

// Picks the newest Health article to feature in the spotlight.
function getSpotlightStory() {
  const posts = [...(articleData[CATEGORY] || [])].sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  );
  const post = posts[0];

  if (!post) return null;

  return {
    href: `/${CATEGORY}/${post.slug}`,
    image: post.image,
    headline: post.title,
    byline: bylineFor(post.author),
    dek: post.dek,
  };
}

export default function Spotlight() {
  const story = getSpotlightStory();

  if (!story) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <div className="border-t-6 border-gray-900 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          {/* Left: image */}
          <div>
            <Link href={story.href} className="block mb-2">
              <img
                src={story.image}
                alt=""
                className="w-full h-auto object-cover"
              />
            </Link>
            <p className="text-xs text-gray-500 leading-snug">
              Placeholder caption. <span className="font-bold">PHOTO CREDIT</span>
            </p>
          </div>

          {/* Right: headline, byline, dek — centered */}
          <div className="text-center md:px-6">
            <Link href={story.href} className="block">
              <h2 className="font-serif font-bold text-gray-900 leading-tight text-2xl md:text-3xl hover:text-blue-700 transition-colors">
                {story.headline}
              </h2>
            </Link>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mt-4">
              {story.byline}
            </p>
            <p className="font-serif text-gray-700 leading-relaxed mt-4 text-base">
              {story.dek}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10 border-b border-gray-500" />
    </section>
  );
}