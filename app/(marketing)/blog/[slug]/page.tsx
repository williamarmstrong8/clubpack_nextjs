import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getAllSlugs, getPostBySlug } from "@/lib/blog"
import { mdxComponents } from "../components/mdx-components"

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) return { title: "Post Not Found" }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    keywords: post.frontmatter.keywords,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      authors: [post.frontmatter.author],
      images: [{ url: post.frontmatter.coverImage }],
    },
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  const { frontmatter, content } = post

  return (
    <>
      <section className="relative pt-32 pb-16 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YxRjVGOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors mb-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
            <span className="inline-block rounded-full bg-blue-50 text-[#0054f9] px-3 py-0.5 font-semibold">
              {frontmatter.category}
            </span>
            <time dateTime={frontmatter.date}>
              {formatDate(frontmatter.date)}
            </time>
            <span>&middot;</span>
            <span>{frontmatter.readingTime} min read</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 tracking-tight leading-[1.1] mb-4">
            {frontmatter.title}
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
            {frontmatter.description}
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YxRjVGOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full relative z-10">
          <article className="max-w-3xl mx-auto">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 bg-white shadow-xl border border-gray-100">
              <Image
                src={frontmatter.coverImage}
                alt={frontmatter.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 lg:p-12">
              <div className="mdx-content">
                <MDXRemote source={content} components={mdxComponents} />
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                Ready to streamline your club&apos;s operations?
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0054f9] hover:bg-[#0040d6] text-white px-8 py-4 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              >
                Get Started with ClubPack
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
