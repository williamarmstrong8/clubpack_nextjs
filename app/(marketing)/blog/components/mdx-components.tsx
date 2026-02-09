import type { MDXComponents } from "mdx/types"
import Image from "next/image"
import Link from "next/link"

/**
 * MDX components styled for the marketing light theme:
 * dark text, white/gray backgrounds, blue accent links.
 */
export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mt-10 mb-4"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 mt-10 mb-4 border-b border-gray-200 pb-2"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-xl sm:text-2xl font-semibold text-gray-900 mt-8 mb-3"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="text-lg font-semibold text-gray-900 mt-6 mb-2"
      {...props}
    />
  ),

  p: (props) => (
    <p className="text-gray-600 leading-relaxed mb-5" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-[#0054f9] pl-4 italic text-gray-600 my-6 bg-blue-50/50 py-2 rounded-r-lg"
      {...props}
    />
  ),
  hr: () => <hr className="border-gray-200 my-8" />,

  ul: (props) => (
    <ul className="list-disc list-outside pl-6 text-gray-600 space-y-2 mb-5" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal list-outside pl-6 text-gray-600 space-y-2 mb-5" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,

  a: (props) => (
    <Link
      {...(props as React.ComponentProps<typeof Link>)}
      className="text-[#0054f9] hover:text-[#0040d6] underline underline-offset-2 font-medium transition-colors"
    />
  ),
  strong: (props) => <strong className="font-semibold text-gray-900" {...props} />,
  em: (props) => <em className="italic text-gray-700" {...props} />,
  code: (props) => (
    <code
      className="bg-gray-100 text-gray-800 rounded px-1.5 py-0.5 text-sm font-mono border border-gray-200"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="bg-gray-100 border border-gray-200 rounded-xl p-4 overflow-x-auto my-6 text-sm text-gray-800"
      {...props}
    />
  ),

  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt ?? ""}
      className="rounded-xl my-6 w-full border border-gray-200"
      loading="lazy"
    />
  ),

  table: (props) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-gray-200">
      <table className="w-full text-left text-gray-600 border-collapse" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-900"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border-b border-gray-100 px-4 py-3" {...props} />
  ),
}
