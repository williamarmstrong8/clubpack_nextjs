const APP_ORIGIN = "https://my.joinclubpack.com";

export default function AnnouncementBanner() {
  return (
    <div
      className="w-full py-2.5 px-4 text-center text-sm font-medium text-white"
      style={{ backgroundColor: "#0054f9" }}
    >
      All clubs now join free.{" "}
      <a
        href={`${APP_ORIGIN}/signup`}
        className="underline underline-offset-2 hover:no-underline font-semibold"
      >
        Start building here
      </a>
    </div>
  );
}
