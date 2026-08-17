import Link from "next/link";

// Adjust this path if this file moves relative to /public/data
import articleData from "../public/data/article.json";
import authorData from "../public/data/author.json";

const CATEGORY = "politics";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

function bylineFor(authorName) {
  const location = authorData[authorName]?.location;
  return location ? `${authorName} | ${location.toUpperCase()}` : authorName;
}

// Pulls all Politics articles (newest first), each used exactly once, and
// splits them into two columns of 3 to match the layout.
function getPoliticsStories() {
  const posts = [...(articleData[CATEGORY] || [])].sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  );

  const stories = posts.slice(0, 6).map((post) => ({
    href: `/${CATEGORY}/${post.slug}`,
    image: post.image,
    imageCaption: "Placeholder caption. PHOTO CREDIT",
    headline: post.title,
    byline: bylineFor(post.author),
    dek: post.dek,
  }));

  return {
    columnOne: stories.slice(0, 3),
    columnTwo: stories.slice(3, 6),
  };
}

function StoryBlock({ story }) {
  return (
    <div>
      <Link href={story.href} className="block mb-2 relative">
        <img src={story.image} alt="" className="w-full h-auto object-cover" />
        {story.hasVideo && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900 ml-0.5">
                <path d="M8 5v14l11-7Z" />
              </svg>
            </span>
          </span>
        )}
      </Link>
      <p className="text-xs text-gray-500 mb-2 leading-snug">{story.imageCaption}</p>
      <Link href={story.href} className="block">
        <h3 className="font-serif font-bold text-gray-900 leading-tight text-lg hover:text-blue-700 transition-colors">
          {story.headline}
        </h3>
      </Link>
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mt-2">
        {story.byline}
      </p>
      <p className="text-sm text-gray-700 leading-relaxed mt-2">{story.dek}</p>
    </div>
  );
}

function AdBox() {
  return (
    <div className="lg:sticky lg:top-24 border border-gray-200">
      <div className="relative">
        <button
          type="button"
          aria-label="Close ad"
          className="absolute top-2 left-2 w-5 h-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center"
        >
          i
        </button>
        <img
          src="/images/img4.webp"
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

export default function MoreNews() {
  const { columnOne, columnTwo } = getPoliticsStories();

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <div className="border-t-4 border-gray-900 pt-4 mb-6">
        <h2 className="font-serif font-bold text-3xl text-black-800 border-b border-gray-900 pb-2">
          POLITICS
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_300px] gap-8">
        {/* Column 1 */}
        <div className="lg:pr-8 lg:border-r lg:border-gray-200 flex flex-col gap-8 divide-y divide-gray-200 [&>*:not(:first-child)]:pt-8">
          {columnOne.map((story) => (
            <StoryBlock key={story.href} story={story} />
          ))}
        </div>

        {/* Column 2 */}
        <div className="lg:pr-8 lg:border-r lg:border-gray-200 flex flex-col gap-8 divide-y divide-gray-200 [&>*:not(:first-child)]:pt-8">
          {columnTwo.map((story) => (
            <StoryBlock key={story.href} story={story} />
          ))}
        </div>

        {/* Column 3: sticky ad */}
        <div>
          <AdBox />
        </div>
      </div>
    </section>
  );
}