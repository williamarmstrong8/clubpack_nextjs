import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getAllPosts } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, insights, and guides for college club leaders — from ClubPack.",
}

/** Pretty-print a date string like "July 22, 2025". */
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <section className="relative pt-32 pb-24 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YxRjVGOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-[1.1]">
            Blog
          </h1>
          <p className="text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tips, insights, and guides for college club leaders.
          </p>
        </div>
      </section>

      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YxRjVGOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full relative z-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <Image
                    src={post.frontmatter.coverImage}
                    alt={post.frontmatter.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <div className="flex flex-col flex-1 p-8">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span className="inline-block rounded-full bg-blue-50 text-[#0054f9] px-3 py-0.5 font-semibold">
                      {post.frontmatter.category}
                    </span>
                    <span>{formatDate(post.frontmatter.date)}</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0054f9] transition-colors line-clamp-2">
                    {post.frontmatter.title}
                  </h2>

                  <p className="text-gray-600 leading-relaxed line-clamp-3 flex-1">
                    {post.frontmatter.description}
                  </p>

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                    <span className="text-sm font-semibold text-[#0054f9] group-hover:text-[#0040d6] transition-colors">
                      Read more →
                    </span>
                    <span className="text-sm text-gray-500">
                      {post.frontmatter.readingTime} min read
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
