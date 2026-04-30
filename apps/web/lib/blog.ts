import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "blog", "content");

export interface BlogFrontmatter {
  title: string;
  subtitle: string;
  description: string;
  date: string;
  author: string;
  categories: string[];
  image: string;
  published: boolean;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
  readingTime: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(BLOG_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      const frontmatter = data as BlogFrontmatter;

      // Skip unpublished posts
      if (frontmatter.published === false) return null;

      const stats = readingTime(content);

      return {
        slug,
        frontmatter,
        content,
        readingTime: stats.text.replace("read", "baca"),
      } as BlogPost;
    })
    .filter(Boolean) as BlogPost[];

  // Sort by date descending
  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const frontmatter = data as BlogFrontmatter;
  const stats = readingTime(content);

  return {
    slug,
    frontmatter,
    content,
    readingTime: stats.text.replace("read", "baca"),
  };
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categorySet = new Set<string>();
  posts.forEach((post) => {
    post.frontmatter.categories?.forEach((cat) => categorySet.add(cat));
  });
  return Array.from(categorySet).sort();
}

export function getRelatedPosts(
  currentSlug: string,
  categories: string[],
  limit = 3
): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const sharedCategories = post.frontmatter.categories?.filter((cat) =>
        categories.includes(cat)
      );
      return { post, score: sharedCategories?.length || 0 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
