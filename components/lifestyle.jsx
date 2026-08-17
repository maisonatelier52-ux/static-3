import Link from "next/link";

// Adjust this path if this file moves relative to /public/data
import articleData from "../public/data/article.json";
import authorData from "../public/data/author.json";

const CATEGORY = "lifestyle";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

function bylineFor(authorName) {
  const location = authorData[authorName]?.location;
  return location ? `${authorName} | ${location.toUpperCase()}` : authorName;
}

// 5 newest Lifestyle articles, each used exactly once across the 5 slots.
function getLifestyleStories() {
  const posts = [...(articleData[CATEGORY] || [])].sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  );

  const [leadPost, middleTopPost, middleBottomPost, rightTopPost, rightBottomPost] = posts;

  const toStory = (post, withImage = true) =>
    post && {
      href: `/${CATEGORY}/${post.slug}`,
      image: withImage ? post.image : undefined,
      imageCaption: "Placeholder caption. PHOTO CREDIT",
      headline: post.title,
      byline: bylineFor(post.author),
      dek: post.dek,
    };

  return {
    lead: toStory(leadPost),
    middleTop: toStory(middleTopPost, false),
    middleBottom: toStory(middleBottomPost),
    rightTop: toStory(rightTopPost),
    rightBottom: toStory(rightBottomPost, false),
  };
}

function Story({ story, headlineSize = "text-lg" }) {
  return (
    <div>
      {story.image && (
        <>
          <Link href={story.href} className="block mb-2">
            <img
              src={story.image}
              alt=""
              className="w-full h-auto object-cover"
            />
          </Link>
          <p className="text-xs text-gray-500 mb-2 leading-snug">
            {story.imageCaption}
          </p>
        </>
      )}
      <Link href={story.href} className="block">
        <h3
          className={`font-serif font-bold text-gray-900 leading-tight hover:text-blue-700 transition-colors ${headlineSize}`}
        >
          {story.headline}
        </h3>
      </Link>
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mt-2">
        {story.byline}
      </p>
      {story.dek && (
        <p className="text-sm text-gray-700 leading-relaxed mt-2">
          {story.dek}
        </p>
      )}
    </div>
  );
}

export default function Lifestyle() {
  const { lead, middleTop, middleBottom, rightTop, rightBottom } =
    getLifestyleStories();

  if (!lead) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-8">
    <div className="border-t-4 border-gray-900 pt-4 mb-6"></div>
      <h2 className="inline-block font-serif font-bold text-2xl text-gray-900 border-b-4 border-gray-900 pb-2 mb-6">
        Lifestyle
      </h2>
    <div/>  

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr_1fr] gap-8">
        {/* Left: lead story */}
        <div className="lg:pr-8 lg:border-r lg:border-gray-200">
          <Story story={lead} headlineSize="text-2xl md:text-3xl" />
        </div>

        {/* Middle: two stacked stories */}
        <div className="lg:pr-8 lg:border-r lg:border-gray-200 flex flex-col gap-6">
          {middleTop && <Story story={middleTop} />}
          <hr className="border-gray-200" />
          {middleBottom && <Story story={middleBottom} />}
        </div>

        {/* Right: two stacked stories */}
        <div className="flex flex-col gap-6">
          {rightTop && <Story story={rightTop} />}
          <hr className="border-gray-200" />
          {rightBottom && <Story story={rightBottom} />}
        </div>
      </div>

      <hr className="border-gray-900 mt-10" />
    </section>
  );
}