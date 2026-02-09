import fs from "fs"
import path from "path"
import matter from "gray-matter"

/** Directory where MDX blog posts live. */
const BLOG_DIR = path.join(process.cwd(), "content", "blog")

/** Shape of the YAML frontmatter in each MDX file. */
export interface BlogFrontmatter {
  title: string
  description: string
  date: string
  author: string
  category: string
  keywords: string[]
  readingTime: number
  coverImage: string
}

/** A blog post with parsed frontmatter + the raw MDX body. */
export interface BlogPost {
  slug: string
  frontmatter: BlogFrontmatter
  content: string
}

/**
 * Return every blog post, sorted by date descending (newest first).
 */
export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"))

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "")
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8")
    const { data, content } = matter(raw)

    return {
      slug,
      frontmatter: data as BlogFrontmatter,
      content,
    }
  })

  // Sort newest → oldest
  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  )
}

/**
 * Get a single post by slug. Returns `null` when the slug doesn't exist.
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)

  return {
    slug,
    frontmatter: data as BlogFrontmatter,
    content,
  }
}

/**
 * Return every slug — used by `generateStaticParams`.
 */
export function getAllSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
}
