export default function AdminLoading() {
  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex animate-pulse flex-col gap-4">
        <div className="h-8 w-48 rounded-md bg-muted" />
        <div className="h-4 w-full max-w-2xl rounded-md bg-muted" />
        <div className="h-4 w-3/4 max-w-xl rounded-md bg-muted" />
        <div className="mt-4 h-32 w-full rounded-lg bg-muted" />
      </div>
    </div>
  )
}
