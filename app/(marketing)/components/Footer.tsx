import Link from "next/link";

const APP_ORIGIN = "https://my.joinclubpack.com";

function SocialIcon({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className="w-11 h-11 rounded-2xl bg-gray-50 text-gray-400 hover:bg-[#0054f9] hover:text-white flex items-center justify-center transition-all duration-300 group"
      aria-hidden="true"
      title={title}
    >
      {children}
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YxRjVGOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-8 group">
              <img
                src="/clubpack-logos/clubpack-logo-large.svg"
                alt="ClubPack"
                className="h-8 w-auto"
                loading="lazy"
                decoding="async"
              />
            </Link>

            <p className="text-gray-500 text-lg mb-10 max-w-md leading-relaxed font-medium">
              The all-in-one platform for modern social clubs. Focus on your
              community, we&apos;ll handle the logistics.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`${APP_ORIGIN}/signup`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#0054f9] hover:bg-[#0040d6] text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              >
                Join for Free
              </a>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                View Pricing
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Platform
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/features"
                  className="text-gray-500 hover:text-[#0054f9] font-medium transition-colors duration-200"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-500 hover:text-[#0054f9] font-medium transition-colors duration-200"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <a
                  href={APP_ORIGIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[#0054f9] font-medium transition-colors duration-200"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Company
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/blog"
                  className="text-gray-500 hover:text-[#0054f9] font-medium transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-500 hover:text-[#0054f9] font-medium transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm font-medium mb-6 md:mb-0">
            © {new Date().getFullYear()} ClubPack. Built for the modern club.
          </p>

          <div className="flex items-center space-x-3">
            <a
              href="#"
              aria-label="Instagram"
              className="group"
              title="Instagram"
            >
              <SocialIcon title="Instagram">
                <svg
                  viewBox="0 0 24 24"
                  className="w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </SocialIcon>
            </a>
            <a href="#" aria-label="X" className="group" title="X">
              <SocialIcon title="X">
                <svg
                  viewBox="0 0 24 24"
                  className="w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4l16 16" />
                  <path d="M20 4L4 20" />
                </svg>
              </SocialIcon>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="group"
              title="LinkedIn"
            >
              <SocialIcon title="LinkedIn">
                <svg
                  viewBox="0 0 24 24"
                  className="w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9v12" />
                  <path d="M6 6.5v.5" />
                  <path d="M10 9v12" />
                  <path d="M10 13c0-2.2 1.8-4 4-4s4 1.8 4 4v8" />
                </svg>
              </SocialIcon>
            </a>
            <a
              href="mailto:hello@clubpack.com"
              aria-label="Email"
              className="group"
              title="Email"
            >
              <SocialIcon title="Email">
                <svg
                  viewBox="0 0 24 24"
                  className="w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 6h16v12H4z" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
              </SocialIcon>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

