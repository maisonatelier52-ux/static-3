import Link from "next/link";

// Adjust this path if this file moves relative to /public/data
import articleData from "../public/data/article.json";
import authorData from "../public/data/author.json";

const CATEGORY = "business";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

function bylineFor(authorName) {
  const location = authorData[authorName]?.location;
  return location ? `${authorName} | ${location.toUpperCase()}` : authorName;
}

// Picks 4 distinct Business articles (newest first) — one for each slot,
// so nothing repeats across lead / middle-top / middle-bottom / right.
function getBusinessStories() {
  const posts = [...(articleData[CATEGORY] || [])].sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  );

  const [leadPost, middleTopPost, middleBottomPost, rightPost] = posts;

  const toStory = (post) =>
    post && {
      href: `/${CATEGORY}/${post.slug}`,
      image: post.image,
      headline: post.title,
      byline: bylineFor(post.author),
      dek: post.dek,
    };

  return {
    lead: toStory(leadPost),
    middleTop: toStory(middleTopPost),
    middleBottom: toStory(middleBottomPost),
    right: toStory(rightPost),
  };
}

export default function TopStories() {
  const { lead, middleTop, middleBottom, right } = getBusinessStories();

  if (!lead) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-8 border-b border-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr_1fr] gap-8">
        {/* Left: lead story */}
        <div className="lg:pr-8 lg:border-r lg:border-gray-200">
          <Link href={lead.href} className="block mb-2">
            <img src={lead.image} alt="" className="w-full h-auto object-cover"/>
          </Link>
          <p className="text-xs text-gray-500 mb-3 leading-snug">
            Placeholder caption. PHOTO CREDIT
          </p>
          <Link href={lead.href} className="block">
            <h2 className="font-serif font-bold text-gray-900 leading-tight hover:text-blue-700 transition-colors text-2xl md:text-4xl">
              {lead.headline}
            </h2>
          </Link>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mt-2">
            {lead.byline}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mt-2">
            {lead.dek}
          </p>
        </div>

        {/* Middle: two stacked stories */}
        <div className="lg:pr-8 lg:border-r lg:border-gray-200 flex flex-col gap-6">
          {middleTop && (
            <div>
              <Link href={middleTop.href} className="block">
                <h2 className="font-serif font-bold text-gray-900 leading-tight hover:text-blue-700 transition-colors text-lg md:text-xl">
                  {middleTop.headline}
                </h2>
              </Link>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mt-2">
                {middleTop.byline}
              </p>
            </div>
          )}

          <hr className="border-gray-200" />

          {middleBottom && (
            <div>
              <Link href={middleBottom.href} className="block mb-2">
                <img src={middleBottom.image} alt="" className="w-full h-auto object-cover"/>
              </Link>
              <p className="text-xs text-gray-500 mb-3 leading-snug">
                Placeholder caption. PHOTO CREDIT
              </p>
              <Link href={middleBottom.href} className="block">
                <h2 className="font-serif font-bold text-gray-900 leading-tight hover:text-blue-700 transition-colors text-lg md:text-xl">
                  {middleBottom.headline}
                </h2>
              </Link>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mt-2">
                {middleBottom.byline}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mt-2">
                {middleBottom.dek}
              </p>
            </div>
          )}
        </div>

        {/* Right: single story */}
        {right && (
          <div>
            <Link href={right.href} className="block mb-2">
              <img src={right.image} alt="" className="w-full h-auto object-cover"/>
            </Link>
            <p className="text-xs text-gray-500 mb-3 leading-snug">Placeholder caption. PHOTO CREDIT</p>
            <Link href={right.href} className="block">
              <h2 className="font-serif font-bold text-gray-900 leading-tight hover:text-blue-700 transition-colors text-lg md:text-3xl">
                {right.headline}
              </h2>
            </Link>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mt-4">
              {right.byline}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mt-4">
              {right.dek}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}