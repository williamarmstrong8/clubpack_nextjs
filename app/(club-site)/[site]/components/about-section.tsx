import type { ClubData } from "../mock-data";

export function AboutSection({ club }: { club: ClubData }) {
  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome to {club.name}
            </h2>
          </div>
          <div>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {club.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

