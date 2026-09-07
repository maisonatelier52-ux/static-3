import Link from "next/link";

// Adjust this path if this file moves relative to /public/data
import articleData from "../public/data/article.json";
import authorData from "../public/data/author.json";

const CATEGORY = "us";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

function bylineFor(authorName) {
  const location = authorData[authorName]?.location;
  return location ? `${authorName} | ${location.toUpperCase()}` : authorName;
}

// Newest U.S. article becomes the lead; the next 3 newest fill the cards.
function getUSStories() {
  const posts = [...(articleData[CATEGORY] || [])].sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  );

  const [leadPost, ...rest] = posts;
  const cardPosts = rest.slice(0, 3);

  const lead = leadPost && {
    href: `/${CATEGORY}/${leadPost.slug}`,
    image: leadPost.image,
    imageCaption: "Placeholder caption. PHOTO CREDIT",
    headline: leadPost.title,
    byline: bylineFor(leadPost.author),
    dek: leadPost.dek,
  };

  const cards = cardPosts.map((post) => ({
    href: `/${CATEGORY}/${post.slug}`,
    image: post.image,
    headline: post.title,
    byline: bylineFor(post.author),
  }));

  return { lead, cards };
}

function AdBox() {
  return (
    <div className="lg:sticky lg:top-24 border border-gray-200">
      <div className="relative">
        <button
          type="button"
          aria-label="Ad info"
          className="absolute top-2 left-2 w-5 h-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center"
        >
          i
        </button>
        <img
          src="/images/img1.webp"
          alt="Advertisement"
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="p-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">Advertisement</span>
        <button
          type="button"
          className="bg-gray-900 hover:bg-gray-700 transition-colors text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5"
        >
          Learn more
        </button>
      </div>
    </div>
  );
}

export default function Highlight() {
  const { lead, cards } = getUSStories();

  if (!lead) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-8">
    <div className="border-t-4 border-gray-900 pt-4 mb-6">
      <h2 className="inline-block font-serif font-bold text-2xl text-gray-900 border-b-2 border-gray-900 pb-2 mb-6">
        U.S.
      </h2>
     </div> 

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Left: main content */}
        <div className="flex flex-col gap-8">
          {/* Top row: image + centered headline/dek */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pb-8 border-b border-gray-200">
            <div>
              <Link href={lead.href} className="block mb-2">
                <img
                  src={lead.image}
                  alt=""
                  className="w-full h-auto object-cover"
                />
              </Link>
              <p className="text-xs text-gray-500 leading-snug">
                {lead.imageCaption}
              </p>
            </div>
            <div className="text-center">
              <Link href={lead.href} className="block">
                <h3 className="font-serif font-bold text-gray-900 leading-tight text-xl md:text-2xl hover:text-blue-700 transition-colors">
                  {lead.headline}
                </h3>
              </Link>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mt-3">
                {lead.byline}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mt-3">
                {lead.dek}
              </p>
            </div>
          </div>

          {/* Bottom row: 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div key={card.href}>
                <Link href={card.href} className="block mb-2">
                  <img
                    src={card.image}
                    alt=""
                    className="w-full h-auto object-cover"
                  />
                </Link>
                <Link href={card.href} className="block">
                  <h3 className="font-serif font-bold text-gray-900 leading-tight text-base hover:text-blue-700 transition-colors">
                    {card.headline}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 mt-2">{card.byline}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: sticky ad */}
        <div>
          <AdBox />
        </div>
      </div>

      <hr className="border-gray-900 mt-10" />
    </section>
  );
}