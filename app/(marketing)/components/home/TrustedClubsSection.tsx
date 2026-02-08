
const TrustedClubsSection = () => {

  // Club logos from promo-logos directory
  const clubs = [
    { name: 'Drifters Club', logo: '/promo-logos/drifters-logo.svg' },
    { name: 'Happy Mile', logo: '/promo-logos/happy-mile-logo.svg' },
    { name: 'Plunge Club', logo: '/promo-logos/plunge-club-logo.svg' },
  ];

  return (
    <section className="pt-8 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Trusted by Leading Clubs
          </h3>
        </div>

        {/* Infinite Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex items-center space-x-12 animate-scroll"
          >
            {/* First set of logos */}
            {clubs.map((club, index) => (
              <div
                key={`first-${index}`}
                className="flex items-center justify-center min-w-[200px]"
              >
                <img
                  src={club.logo}
                  alt={`${club.name} logo`}
                  className="h-12 w-auto object-contain filter brightness-0 opacity-60"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}

            {/* Duplicate set for seamless loop */}
            {clubs.map((club, index) => (
              <div
                key={`second-${index}`}
                className="flex items-center justify-center min-w-[200px]"
              >
                <img
                  src={club.logo}
                  alt={`${club.name} logo`}
                  className="h-12 w-auto object-contain filter brightness-0 opacity-60"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>

          {/* Gradient overlays for smooth fade */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
};

export default TrustedClubsSection;