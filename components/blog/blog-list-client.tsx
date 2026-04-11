"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpDown, X, Clock, User, Tag } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

interface BlogListClientProps {
  posts: BlogPost[];
  categories: string[];
}

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogListClient({ posts, categories }: BlogListClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (post) =>
          post.frontmatter.title.toLowerCase().includes(q) ||
          post.frontmatter.description.toLowerCase().includes(q) ||
          post.frontmatter.categories.some((c) => c.toLowerCase().includes(q)) ||
          post.frontmatter.author.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((post) =>
        selectedCategories.some((cat) =>
          post.frontmatter.categories.includes(cat)
        )
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.frontmatter.date).getTime() -
            new Date(a.frontmatter.date).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.frontmatter.date).getTime() -
            new Date(b.frontmatter.date).getTime()
        );
        break;
      case "title-asc":
        result.sort((a, b) =>
          a.frontmatter.title.localeCompare(b.frontmatter.title)
        );
        break;
      case "title-desc":
        result.sort((a, b) =>
          b.frontmatter.title.localeCompare(a.frontmatter.title)
        );
        break;
    }

    return result;
  }, [posts, search, selectedCategories, sortBy]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSortBy("newest");
  };

  const hasActiveFilters =
    search.trim() || selectedCategories.length > 0 || sortBy !== "newest";

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari artikel berdasarkan judul, deskripsi, atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              showFilters || selectedCategories.length > 0
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
            {selectedCategories.length > 0 && (
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {selectedCategories.length}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700">
              <ArrowUpDown className="h-4 w-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent outline-none cursor-pointer appearance-none pr-4"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="title-asc">Judul A-Z</option>
                <option value="title-desc">Judul Z-A</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </button>
          )}

          {/* Result count */}
          <span className="ml-auto text-sm text-gray-500">
            {filteredPosts.length} dari {posts.length} artikel
          </span>
        </div>

        {/* Category Pills */}
        {showFilters && (
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
            <p className="mb-3 text-sm font-medium text-gray-700">
              Filter berdasarkan kategori:
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    selectedCategories.includes(cat)
                      ? "bg-gray-900 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Blog Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20">
          <Search className="mb-4 h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900">
            Tidak ada artikel ditemukan
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Coba ubah kata kunci pencarian atau filter kategori Anda
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
          <img
            src={post.frontmatter.image}
            alt={post.frontmatter.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Categories */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.frontmatter.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
              >
                <Tag className="h-3 w-3" />
                {cat}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className="mb-2 text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-orange-500 line-clamp-2">
            {post.frontmatter.title}
          </h2>

          {/* Description */}
          <p className="mb-4 text-sm leading-relaxed text-gray-500 line-clamp-2">
            {post.frontmatter.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {post.frontmatter.author}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>
            <span className="ml-auto">
              {formatDate(post.frontmatter.date)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
