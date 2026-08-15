/** Shown while a route segment streams in — keeps layout from jumping. */
export default function Loading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading">
      <div className="border-b border-line pb-6">
        <div className="skeleton h-3 w-40" />
        <div className="skeleton mt-3 h-8 w-72 max-w-full" />
        <div className="skeleton mt-3 h-4 w-full max-w-prose" />
      </div>

      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="flex gap-3">
              <div className="skeleton h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
            <div className="skeleton mt-5 h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
