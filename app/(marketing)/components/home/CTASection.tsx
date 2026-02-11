import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full relative z-10">
        <div className="bg-[#0054f9] rounded-[2.5rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,84,249,0.25)] border border-blue-400/20">
          {/* Subtle noise/grain texture */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
          
          {/* Floating light orb */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
              Built specifically for <br className="hidden sm:block" /> social clubs.
            </h2>
            <p className="text-2xl text-blue-50/80 mb-12 leading-relaxed">
              Join the most innovative clubs building their community on ClubPack. Get started in minutes.
            </p>
            
            <div className="flex justify-center">
              <Button
                asChild
                className="h-auto bg-white text-[#0054f9] hover:bg-gray-50 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] w-full sm:w-auto"
              >
                <a
                  href="https://my.joinclubpack.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Create your club free
                </a>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8">
               <div className="flex flex-col items-center">
                 <span className="text-white text-2xl font-bold">100+</span>
                 <span className="text-blue-100/60 text-xs uppercase tracking-widest font-bold mt-1">Clubs Joined</span>
               </div>
               <div className="w-px h-8 bg-white/10" />
               <div className="flex flex-col items-center">
                 <span className="text-white text-2xl font-bold">3 mins</span>
                 <span className="text-blue-100/60 text-xs uppercase tracking-widest font-bold mt-1">Setup Time</span>
               </div>
               <div className="w-px h-8 bg-white/10" />
               <div className="flex flex-col items-center">
                 <span className="text-white text-2xl font-bold">Free</span>
                 <span className="text-blue-100/60 text-xs uppercase tracking-widest font-bold mt-1">To Get Started</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
