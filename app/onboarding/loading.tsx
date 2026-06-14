export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="flex min-h-130 w-full max-w-3xl overflow-hidden rounded-xl border shadow-sm">
        {/* Brand panel — static, so we just show its dark surface */}
        <div className="hidden w-58 shrink-0 bg-slate-800 p-6 md:block" />

        {/* Form area skeleton */}
        <div className="flex-1 animate-pulse space-y-4 bg-background p-7">
          {/* Progress bars */}
          <div className="flex gap-1.5">
            <span className="h-0.75 flex-1 rounded-full bg-indigo-600" />
            <span className="h-0.75 flex-1 rounded-full bg-border" />
          </div>
          {/* Step label + heading + description */}
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-5 w-48 rounded bg-muted" />
          <div className="h-3 w-64 rounded bg-muted" />
          {/* Currency field */}
          <div className="mt-2 h-14.5 w-full rounded-lg bg-muted" />
          {/* Timezone field */}
          <div className="h-13 w-full rounded-lg bg-muted" />
          {/* CTA */}
          <div className="h-11 w-full rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}