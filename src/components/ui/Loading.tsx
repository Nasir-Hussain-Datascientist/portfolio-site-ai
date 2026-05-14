export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-brand-500/20 [border-radius:var(--radius-full)]"></div>
        <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent [border-radius:var(--radius-full)] animate-spin"></div>
      </div>
      <p className="mt-4 text-[var(--text-muted)] text-sm font-medium animate-pulse tracking-widest uppercase">Processing Intelligence...</p>
    </div>
  );
}
