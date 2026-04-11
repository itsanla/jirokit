import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User, Calendar, Tag } from "lucide-react";
import {
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts,
  formatDate,
} from "@/lib/blog";
import MdxContent from "@/components/blog/mdx-content";
import BlogFooter from "@/components/blog-footer";
import type { Metadata } from "next";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: `${post.frontmatter.title} — ruang.studio`,
    description: post.frontmatter.description,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(
    post.slug,
    post.frontmatter.categories,
    3
  );

  return (
    <main className="min-h-screen bg-white">
      {/* Header with Image */}
      <div className="relative">
        {/* Background Image */}
        <div className="relative h-[340px] w-full overflow-hidden bg-gray-900 md:h-[420px] lg:h-[480px]">
          <img
            src={post.frontmatter.image}
            alt={post.frontmatter.title}
            className="h-full w-full object-cover opacity-40"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/40" />
        </div>

        {/* Navigation */}
        <div className="absolute left-0 right-0 top-0 z-20">
          <div className="container mx-auto flex items-center justify-between px-4 py-5 md:px-6 lg:px-12 xl:px-16">
            <Link
              href="/blog"
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Halaman Blog</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/icon.webp"
                alt="ruang.studio"
                width={28}
                height={28}
                className="rounded-lg"
                decoding="async"
              />
              <span className="text-lg font-bold text-white">
                ruang.studio
              </span>
            </Link>
          </div>
        </div>

        {/* Title Area (overlapping image) */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 pb-8 md:px-6 md:pb-12 lg:px-12 xl:px-16">
            <div className="max-w-4xl">
              {/* Categories */}
              <div className="mb-4 flex flex-wrap gap-2">
                {post.frontmatter.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                  >
                    <Tag className="h-3 w-3" />
                    {cat}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                {post.frontmatter.title}
              </h1>

              {post.frontmatter.subtitle && (
                <p className="mt-3 text-base text-white/70 md:text-lg">
                  {post.frontmatter.subtitle}
                </p>
              )}

              {/* Meta */}
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/60">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {post.frontmatter.author}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.frontmatter.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.readingTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-12 xl:px-16">
        <article className="mx-auto max-w-4xl py-10 md:py-16">
          <MdxContent source={post.content} />
        </article>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50/50">
          <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 lg:px-12 xl:px-16">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  Artikel Terkait
                </h2>
                <p className="mt-2 text-gray-500">
                  Baca juga artikel lain dengan topik serupa
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group block"
                  >
                    <article className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1">
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                        <img
                          src={related.frontmatter.image}
                          alt={related.frontmatter.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="p-5">
                        <div className="mb-2 flex flex-wrap gap-1.5">
                          {related.frontmatter.categories
                            .slice(0, 2)
                            .map((cat) => (
                              <span
                                key={cat}
                                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                              >
                                {cat}
                              </span>
                            ))}
                        </div>
                        <h3 className="mb-2 text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-orange-500 line-clamp-2">
                          {related.frontmatter.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {related.frontmatter.description}
                        </p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {related.readingTime}
                          </span>
                          <span>{formatDate(related.frontmatter.date)}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <BlogFooter />
    </main>
  );
}
