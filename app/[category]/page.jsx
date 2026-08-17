import Link from "next/link";

// Adjust these paths if this file moves relative to /public/data
import articleData from "../../public/data/article.json";
import authorData from "../../public/data/author.json";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

function bylineFor(authorName) {
  const location = authorData[authorName]?.location;
  return location ? `${authorName} | ${location.toUpperCase()}` : authorName;
}

// Looks up all articles for this category in article.json. The first
// (newest) article becomes the lead story; the rest fill the grid below.
function getCategoryArticles(category) {
  const posts = [...(articleData[category] || [])].sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  );

  const [leadPost, ...restPosts] = posts;

  return {
    label: category.replace(/-/g, " "),
    description:
      "Placeholder category description: a short line summarizing what readers will find in this section.",
    lead: leadPost
      ? {
          href: `/${category}/${leadPost.slug}`,
          image: leadPost.image,
          imageCaption: "Placeholder caption. PHOTO CREDIT",
          headline: leadPost.title,
          byline: bylineFor(leadPost.author),
          dek: leadPost.dek,
        }
      : null,
    articles: restPosts.map((post) => ({
      href: `/${category}/${post.slug}`,
      image: post.image,
      headline: post.title,
      description: post.dek,
      byline: bylineFor(post.author),
    })),
  };
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

export async function generateMetadata({ params }) {
  const { category } = await params;
  const data = getCategoryArticles(category);
  return {
    title: `${data.label} | NewsDesk`,
    description: data.description,
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const data = getCategoryArticles(category);

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      {/* Category heading */}
      <div className="mb-8">
        <h1 className="font-serif font-bold text-gray-900 text-3xl md:text-4xl capitalize">
          {data.label}
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl">{data.description}</p>
        <hr className="border-gray-900 border-t-2 mt-4" />
      </div>

      {/* Lead story */}
      {data.lead && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pb-8 border-b border-gray-200 mb-8">
          <div>
            <Link href={data.lead.href} className="block mb-2">
              <img
                src={data.lead.image}
                alt=""
                className="w-full h-auto object-cover"
              />
            </Link>
            <p className="text-xs text-gray-500 leading-snug">
              {data.lead.imageCaption}
            </p>
          </div>
          <div>
            <Link href={data.lead.href} className="block">
              <h2 className="font-serif font-bold text-gray-900 leading-tight text-2xl md:text-3xl hover:text-blue-700 transition-colors">
                {data.lead.headline}
              </h2>
            </Link>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mt-3">
              {data.lead.byline}
            </p>
            <p className="text-base text-gray-700 leading-relaxed mt-3">
              {data.lead.dek}
            </p>
          </div>
        </div>
      )}

      {/* Article grid + sticky ad */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
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

        <div>
          <AdBox />
        </div>
      </div>

      {/* Pagination */}
      {/*  */}
    </main>
  );
}