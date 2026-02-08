import type { ClubData } from "../mock-data";

export function AboutSection({ club }: { club: ClubData }) {
  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Welcome to {club.name}
            </h2>
          </div>
          <div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {club.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

