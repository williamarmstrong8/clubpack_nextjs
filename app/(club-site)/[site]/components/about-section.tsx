import type { ClubData } from "../mock-data";

export function AboutSection({ club }: { club: ClubData }) {
  return (
    <section id="about" className="relative bg-white py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-0 grid-cols-1 items-center gap-12 md:grid-cols-2">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to
            <span className="block">{club.name}</span>
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 sm:text-xl">
            {club.description}
          </p>
        </div>
      </div>
    </section>
  );
}
