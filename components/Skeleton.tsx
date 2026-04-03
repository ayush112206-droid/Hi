'use client';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-white/5 rounded-xl ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <Skeleton className="aspect-video w-full" />
      <Skeleton className="h-6 w-3/4" />
    </div>
  );
}
